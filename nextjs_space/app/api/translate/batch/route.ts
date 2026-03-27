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
  s = s.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  return s.trim();
}

/** Safely parse JSON from LLM response */
function safeParseJSON(raw: string): any {
  const cleaned = extractJSON(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
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

/** Extract array from LLM response (handles both direct array and object-wrapped array) */
function extractArray(parsed: any): any[] | null {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    for (const key of Object.keys(parsed)) {
      if (Array.isArray(parsed[key])) return parsed[key];
    }
  }
  return null;
}

async function callBatchLLM(prompt: string, apiKey: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout for batch

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
        max_tokens: 8000,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('[batch-translate] LLM API error:', response.status, errText);
      throw new Error(`LLM API returned ${response.status}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? '';
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    const { articles, locale } = await request.json();

    if (!locale || !LANG_MAP[locale]) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }
    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ error: 'No articles provided' }, { status: 400 });
    }

    const articleIds = articles.map((a: any) => a.id).filter(Boolean);

    // 1. Fetch all cached translations for these articles + locale
    let cached: any[] = [];
    try {
      cached = await prisma.articleTranslation.findMany({
        where: { articleId: { in: articleIds }, locale },
        select: { articleId: true, title: true, excerpt: true },
      });
    } catch (err) {
      console.error('Batch cache lookup error:', err);
    }

    const cachedMap: Record<string, { title: string; excerpt: string }> = {};
    for (const c of cached) {
      cachedMap[c.articleId] = { title: c.title, excerpt: c.excerpt || '' };
    }

    // 2. Find articles that need translation
    const needTranslation = articles.filter((a: any) => a.id && !cachedMap[a.id]);

    // 3. If there are articles to translate, batch translate via LLM
    if (needTranslation.length > 0) {
      const apiKey = process.env.ABACUSAI_API_KEY;
      if (apiKey) {
        const targetLang = LANG_MAP[locale];

        // Process in chunks of 8 to avoid overly long prompts
        const CHUNK_SIZE = 8;
        for (let chunk = 0; chunk < needTranslation.length; chunk += CHUNK_SIZE) {
          const batch = needTranslation.slice(chunk, chunk + CHUNK_SIZE);
          const itemsText = batch.map((a: any, i: number) =>
            `[${i}] Title: ${a.title || ''}\nExcerpt: ${a.excerpt || ''}`
          ).join('\n\n');

          // Use object format prompt since json_object mode returns objects
          const prompt = `You are a professional translator specializing in sports journalism (pickleball). Translate the following article titles and excerpts from English to ${targetLang}.

Rules:
- Keep proper nouns (player names, tournament names, brand names, city names) in their original form
- Maintain the journalistic tone
- Respond ONLY with the JSON object, no markdown

${itemsText}

Respond in this exact JSON format (object with "translations" array, same order as input):
{"translations": [{"title": "translated title", "excerpt": "translated excerpt"}, ...]}

Respond with raw JSON only.`;

          // Try with one retry
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const raw = await callBatchLLM(prompt, apiKey);
              const parsed = safeParseJSON(raw);
              const translated = extractArray(parsed);

              if (translated && translated.length > 0) {
                for (let i = 0; i < batch.length && i < translated.length; i++) {
                  const art = batch[i];
                  const tr = translated[i];
                  if (tr?.title) {
                    const result = { title: tr.title, excerpt: tr.excerpt || '' };
                    cachedMap[art.id] = result;
                    // Save to DB (non-blocking)
                    prisma.articleTranslation.upsert({
                      where: { articleId_locale: { articleId: art.id, locale } },
                      create: { articleId: art.id, locale, title: result.title, excerpt: result.excerpt, content: '' },
                      update: { title: result.title, excerpt: result.excerpt },
                    }).catch((err: any) => console.error('Batch cache save error:', err));
                  }
                }
                break; // Success, no need to retry
              } else {
                console.error(`[batch-translate] Parse failed (attempt ${attempt + 1}), raw:`, raw.substring(0, 300));
                if (attempt === 0) {
                  await new Promise(r => setTimeout(r, 2000));
                }
              }
            } catch (err) {
              console.error(`[batch-translate] LLM error (attempt ${attempt + 1}):`, err);
              if (attempt === 0) {
                await new Promise(r => setTimeout(r, 2000));
              }
            }
          }
        }
      }
    }

    // 4. Return translations map
    return NextResponse.json({ translations: cachedMap });
  } catch (err: any) {
    console.error('Batch translation error:', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}