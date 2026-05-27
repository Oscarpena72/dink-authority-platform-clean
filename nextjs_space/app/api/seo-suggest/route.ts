export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, excerpt, content, category } = body || {};

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    // Strip HTML from content for the prompt
    const plainContent = (content || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim().slice(0, 1500);

    const prompt = `You are an SEO expert for a pickleball magazine called "Dink Authority Magazine". Based on the article information below, generate SEO suggestions.

Article Title: ${title}
Category: ${category || 'news'}
Excerpt: ${excerpt || '(none)'}
Content Preview: ${plainContent || '(none)'}

Please respond in JSON format with the following structure:
{
  "seoTitle": "An optimized SEO title (50-60 chars, include primary keyword)",
  "seoDescription": "An optimized meta description (140-155 chars, compelling, include CTA)",
  "ogTitle": "An engaging social media title (shorter, punchy, 40-60 chars)",
  "ogDescription": "Social media description optimized for sharing (100-140 chars)",
  "slug": "optimized-url-slug-with-keywords",
  "focusKeyword": "primary focus keyword or phrase",
  "secondaryKeywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- SEO Title should include the primary keyword near the beginning
- Meta description should be actionable and include a subtle CTA
- OG Title should be attention-grabbing for social media
- Slug should be concise, keyword-rich, lowercase, hyphens only
- Focus keyword should be the most important search term
- Secondary keywords should be 2-4 related terms
- Keep everything relevant to pickleball/sports context

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('[seo-suggest] LLM API error:', response.status, errText);
      return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content || '{}';
    
    let suggestions;
    try {
      suggestions = JSON.parse(raw);
    } catch {
      console.error('[seo-suggest] Failed to parse LLM response:', raw);
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    return NextResponse.json(suggestions);
  } catch (error: any) {
    console.error('[seo-suggest] Error:', error?.message);
    return NextResponse.json({ error: 'Failed to generate SEO suggestions' }, { status: 500 });
  }
}
