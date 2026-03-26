export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

const LANG_MAP: Record<string, string> = {
  es: 'Spanish',
  pt: 'Brazilian Portuguese',
};

export async function POST(request: Request) {
  try {
    const { title, excerpt, content, locale } = await request.json();

    if (!locale || !LANG_MAP[locale]) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }
    if (!title && !content) {
      return NextResponse.json({ error: 'Nothing to translate' }, { status: 400 });
    }

    const targetLang = LANG_MAP[locale];

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

    const apiKey = process.env.ABACUSAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Translation service not configured' }, { status: 500 });
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 16000,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('LLM API error:', response.status, await response.text().catch(() => ''));
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';

    try {
      const translated = JSON.parse(raw);
      return NextResponse.json({
        title: translated.title || title,
        excerpt: translated.excerpt || excerpt,
        content: translated.content || content,
      });
    } catch {
      console.error('Failed to parse translation response:', raw.substring(0, 200));
      return NextResponse.json({ error: 'Translation parsing failed' }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Translation error:', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
