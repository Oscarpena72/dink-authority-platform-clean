export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const LANG_MAP: Record<string, string> = {
  es: 'Spanish',
  pt: 'Brazilian Portuguese',
};

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
        try {
          const targetLang = LANG_MAP[locale];
          const itemsText = needTranslation.map((a: any, i: number) =>
            `[${i}] Title: ${a.title || ''}\nExcerpt: ${a.excerpt || ''}`
          ).join('\n\n');

          const prompt = `You are a professional translator specializing in sports journalism (pickleball). Translate the following article titles and excerpts from English to ${targetLang}.

Rules:
- Keep proper nouns (player names, tournament names, brand names, city names) in their original form
- Maintain the journalistic tone
- Respond ONLY with the JSON array, no markdown

${itemsText}

Respond in this exact JSON format (array with same indexes):
[{"title": "translated title", "excerpt": "translated excerpt"}, ...]

Respond with raw JSON only.`;

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
          });

          if (response.ok) {
            const data = await response.json();
            const raw = data?.choices?.[0]?.message?.content ?? '';
            try {
              let translated = JSON.parse(raw);
              // Handle both array and object-with-array responses
              if (!Array.isArray(translated)) {
                const keys = Object.keys(translated);
                for (const k of keys) {
                  if (Array.isArray(translated[k])) { translated = translated[k]; break; }
                }
              }
              if (Array.isArray(translated)) {
                // Save to cache and add to map
                for (let i = 0; i < needTranslation.length && i < translated.length; i++) {
                  const art = needTranslation[i];
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
              }
            } catch {
              console.error('Failed to parse batch translation:', raw.substring(0, 200));
            }
          }
        } catch (err) {
          console.error('Batch LLM translation error:', err);
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
