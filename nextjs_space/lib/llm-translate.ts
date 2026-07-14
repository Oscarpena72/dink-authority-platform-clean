/**
 * Reusable LLM translation helper for the article duplication / translation flow.
 *
 * IMPORTANT: This is intentionally SEPARATE from `app/api/translate/route.ts`, which
 * powers the on-the-fly translation cache (ArticleTranslation model). This helper does
 * NOT read or write that cache. It is used only when an admin explicitly duplicates an
 * article into a new locale-specific Article row (Bloque 3 of the multilingual plan).
 */

export type TranslatableLocale = 'es' | 'pt';

const LANG_MAP: Record<TranslatableLocale, string> = {
  es: 'Spanish',
  pt: 'Brazilian Portuguese',
};

export interface ArticleFieldsToTranslate {
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
}

export interface TranslatedArticleFields {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
}

/** Strip markdown code fences and extract valid JSON from LLM output */
function extractJSON(raw: string): string {
  let s = (raw ?? '').trim();
  s = s.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  return s.trim();
}

function safeParseJSON(raw: string): any {
  const cleaned = extractJSON(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch { /* fall through */ }
    }
    return null;
  }
}

async function callLLM(prompt: string, apiKey: string, maxTokens = 16000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
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
      console.error('[llm-translate] LLM API error:', response.status, errText);
      throw new Error(`LLM API returned ${response.status}`);
    }
    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? '';
  } finally {
    clearTimeout(timeout);
  }
}

async function callLLMWithRetry(prompt: string, apiKey: string, maxTokens = 16000): Promise<string> {
  try {
    return await callLLM(prompt, apiKey, maxTokens);
  } catch (err) {
    console.warn('[llm-translate] First attempt failed, retrying...', (err as Error)?.message);
    await new Promise((r) => setTimeout(r, 2000));
    return await callLLM(prompt, apiKey, maxTokens);
  }
}

/**
 * Translate the core fields of an article into the target locale using the LLM.
 * Returns the translated fields. On any failure the corresponding field falls back
 * to the original English text, so the caller always gets a usable object.
 */
export async function translateArticleFields(
  fields: ArticleFieldsToTranslate,
  locale: TranslatableLocale,
): Promise<TranslatedArticleFields> {
  const apiKey = process.env.ABACUSAI_API_KEY;
  const original: TranslatedArticleFields = {
    title: fields.title ?? '',
    excerpt: fields.excerpt ?? '',
    content: fields.content ?? '',
    metaTitle: fields.metaTitle ?? '',
    metaDescription: fields.metaDescription ?? '',
    ogTitle: fields.ogTitle ?? '',
    ogDescription: fields.ogDescription ?? '',
  };

  if (!apiKey) {
    console.error('[llm-translate] ABACUSAI_API_KEY not configured; returning originals');
    return original;
  }

  const targetLang = LANG_MAP[locale];

  const prompt = `You are a professional translator specializing in sports journalism, specifically pickleball. Translate the following article fields from English to ${targetLang}.

Rules:
- Maintain ALL HTML tags in the content field exactly as they are — do not add, remove or modify any tags
- Keep proper nouns (player names, tournament names, brand names, city names) in their original form
- Maintain the journalistic tone and style
- If a field is empty, return it as an empty string
- Do not add any commentary or notes
- Respond ONLY with a raw JSON object, no markdown formatting

Fields to translate:
Title: ${original.title}
Excerpt: ${original.excerpt}
SEO Title: ${original.metaTitle}
SEO Description: ${original.metaDescription}
Open Graph Title: ${original.ogTitle}
Open Graph Description: ${original.ogDescription}
Content (HTML): ${original.content}

Respond in this exact JSON format:
{"title": "...", "excerpt": "...", "metaTitle": "...", "metaDescription": "...", "ogTitle": "...", "ogDescription": "...", "content": "..."}`;

  try {
    const raw = await callLLMWithRetry(prompt, apiKey, 16000);
    const parsed = safeParseJSON(raw);
    if (!parsed || typeof parsed !== 'object') {
      console.error('[llm-translate] parse failed, raw:', String(raw).substring(0, 300));
      return original;
    }
    return {
      title: parsed.title || original.title,
      excerpt: parsed.excerpt ?? original.excerpt,
      content: parsed.content || original.content,
      metaTitle: parsed.metaTitle ?? original.metaTitle,
      metaDescription: parsed.metaDescription ?? original.metaDescription,
      ogTitle: parsed.ogTitle ?? original.ogTitle,
      ogDescription: parsed.ogDescription ?? original.ogDescription,
    };
  } catch (err) {
    console.error('[llm-translate] translation failed:', (err as Error)?.message);
    return original;
  }
}
