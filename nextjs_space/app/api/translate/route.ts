export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const LANG_MAP: Record<string, string> = {
  es: 'Spanish',
  pt: 'Brazilian Portuguese',
};

/** Strip markdown code fences and extract valid JSON from LLM output */
function extractJSON(raw: string): string {
  let s = raw.trim();
  // Remove ```json ... ``` or ``` ... ``` wrappers
  s = s.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  s = s.trim();
  return s;
}

/** Safely parse JSON from LLM response with fallback extraction */
function safeParseJSON(raw: string): any {
  const cleaned = extractJSON(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to find first { ... } or [ ... ] in the string
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch { /* fall through */ }
    }
    const arrMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try { return JSON.parse(arrMatch[0]); } catch { /* fall through */ }
    }
    return null;
  }
}

async function callLLM(prompt: string, apiKey: string, maxTokens = 16000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

  try {
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('LLM API error:', response.status, errText);
      throw new Error(`LLM API returned ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? '';
  } finally {
    clearTimeout(timeout);
  }
}

/** Call LLM with one automatic retry on failure */
async function callLLMWithRetry(prompt: string, apiKey: string, maxTokens = 16000): Promise<string> {
  try {
    return await callLLM(prompt, apiKey, maxTokens);
  } catch (err) {
    console.warn('[translate] First LLM attempt failed, retrying...', (err as Error)?.message);
    // Wait 2s before retry
    await new Promise(r => setTimeout(r, 2000));
    return await callLLM(prompt, apiKey, maxTokens);
  }
}

/* ──────────── Phase-based translation ──────────── */

export async function POST(request: Request) {
  try {
    const { articleId, title, excerpt, content, locale, phase } = await request.json();

    if (!locale || !LANG_MAP[locale]) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }
    if (!title && !content) {
      return NextResponse.json({ error: 'Nothing to translate' }, { status: 400 });
    }

    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Translation service not configured' }, { status: 500 });
    }

    const targetLang = LANG_MAP[locale];
    console.log(`[translate] phase=${phase || 'full'}, locale=${locale}, articleId=${articleId?.substring(0, 8)}...`);

    // 1. Check persistent DB cache first
    if (articleId) {
      try {
        const cached = await prisma.articleTranslation.findUnique({
          where: { articleId_locale: { articleId, locale } },
        });
        if (cached) {
          const hasContent = cached.content && cached.content.length > 10;

          // For phase=meta, return title+excerpt (include content if available for full cache hit)
          if (phase === 'meta' && cached.title) {
            return NextResponse.json({
              title: cached.title,
              excerpt: cached.excerpt || excerpt || '',
              ...(hasContent ? { content: cached.content } : {}),
              cached: true,
            });
          }
          // For phase=content, only return if content exists
          if (phase === 'content' && hasContent) {
            return NextResponse.json({
              content: cached.content,
              cached: true,
            });
          }
          // For full (no phase): return only if content exists
          if (!phase && hasContent) {
            return NextResponse.json({
              title: cached.title || title,
              excerpt: cached.excerpt || excerpt || '',
              content: cached.content,
              cached: true,
            });
          }
          // Otherwise fall through to translate what's missing
        }
      } catch (err) {
        console.error('Cache lookup error:', err);
      }
    }

    /* ── PHASE: meta — translate title + excerpt only (fast) ── */
    if (phase === 'meta') {
      const prompt = `Translate the following pickleball article metadata from English to ${targetLang}.
Keep proper nouns (player names, tournament names, brand names, city names) in their original form.
Respond with raw JSON only.

Title: ${title || ''}
Excerpt: ${excerpt || ''}

JSON format: {"title": "translated title", "excerpt": "translated excerpt"}`;

      const raw = await callLLMWithRetry(prompt, apiKey, 1000);
      const translated = safeParseJSON(raw);

      if (!translated || !translated.title) {
        console.error('[translate] meta parse failed, raw:', raw.substring(0, 300));
        return NextResponse.json({ error: 'Translation parsing failed' }, { status: 500 });
      }

      const result = {
        title: translated.title || title,
        excerpt: translated.excerpt || excerpt || '',
      };

      // Upsert title+excerpt (leave content empty if new)
      if (articleId) {
        try {
          await prisma.articleTranslation.upsert({
            where: { articleId_locale: { articleId, locale } },
            create: { articleId, locale, title: result.title, excerpt: result.excerpt, content: '' },
            update: { title: result.title, excerpt: result.excerpt },
          });
        } catch (err) {
          console.error('Cache save error (meta):', err);
        }
      }

      return NextResponse.json({ ...result, cached: false });
    }

    /* ── PHASE: content — translate body HTML only ── */
    if (phase === 'content') {
      const prompt = `You are a professional translator specializing in sports journalism (pickleball). Translate the following HTML content from English to ${targetLang}.

Rules:
- Maintain ALL HTML tags exactly as they are — do not add, remove or modify any tags
- Keep proper nouns (player names, tournament names, brand names, city names) in their original form
- Maintain the journalistic tone and style
- Do not add any commentary
- Respond with raw JSON only

HTML Content:
${content || ''}

JSON format: {"content": "translated HTML content"}`;

      const raw = await callLLMWithRetry(prompt, apiKey, 16000);
      const translated = safeParseJSON(raw);

      if (!translated || !translated.content) {
        console.error('[translate] content parse failed, raw:', raw.substring(0, 300));
        return NextResponse.json({ error: 'Translation parsing failed' }, { status: 500 });
      }

      const translatedContent = translated.content || content;

      // Update content in DB
      if (articleId) {
        try {
          await prisma.articleTranslation.upsert({
            where: { articleId_locale: { articleId, locale } },
            create: { articleId, locale, title: title, excerpt: excerpt || '', content: translatedContent },
            update: { content: translatedContent },
          });
        } catch (err) {
          console.error('Cache save error (content):', err);
        }
      }

      return NextResponse.json({ content: translatedContent, cached: false });
    }

    /* ── LEGACY / FULL: translate everything at once (backward compat for batch) ── */
    const prompt = `You are a professional translator specializing in sports journalism, specifically pickleball. Translate the following article content from English to ${targetLang}.

Rules:
- Maintain all HTML tags exactly as they are
- Keep proper nouns (player names, tournament names, brand names, city names) in their original form
- Maintain the journalistic tone and style
- Do not add any commentary or notes
- Respond ONLY with the JSON object, no markdown formatting

Translate these fields:

Title: ${title || ''}

Excerpt: ${excerpt || ''}

Content (HTML): ${content || ''}

Respond in this exact JSON format:
{"title": "translated title", "excerpt": "translated excerpt", "content": "translated HTML content"}

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`;

    const raw = await callLLMWithRetry(prompt, apiKey, 16000);
    const translated = safeParseJSON(raw);

    if (!translated || !translated.title) {
      console.error('[translate] full parse failed, raw:', raw.substring(0, 300));
      return NextResponse.json({ error: 'Translation parsing failed' }, { status: 500 });
    }

    const result = {
      title: translated.title || title,
      excerpt: translated.excerpt || excerpt || '',
      content: translated.content || content,
    };

    if (articleId) {
      try {
        await prisma.articleTranslation.upsert({
          where: { articleId_locale: { articleId, locale } },
          create: { articleId, locale, title: result.title, excerpt: result.excerpt, content: result.content },
          update: { title: result.title, excerpt: result.excerpt, content: result.content },
        });
      } catch (err) {
        console.error('Cache save error:', err);
      }
    }

    return NextResponse.json({ ...result, cached: false });
  } catch (err: any) {
    console.error('Translation error:', err?.message || err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}