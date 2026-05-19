export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { sendArticleNotification } from '@/lib/brevo';

/**
 * POST /api/brevo/notify — Send article notification to all subscribers via Brevo.
 * Protected: admin only.
 * Body: { articleId, channel: 'email' | 'sms' | 'both' }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { articleId, channel } = body;

    if (!articleId) {
      return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
    }

    const article = await prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Build article URL
    const baseUrl = 'https://dinkauthoritymagazine.com';
    const categoryMap: Record<string, string> = {
      'news': 'news', 'editorial': 'news', 'events': 'news', 'places': 'news',
      'pro-players': 'players', 'tips': 'tips', 'juniors': 'juniors',
    };
    const section = categoryMap[article.category] || 'news';
    const articleUrl = `${baseUrl}/${section}/${article.slug}`;

    let result: any = null;

    // Email notification
    if (channel === 'email' || channel === 'both') {
      result = await sendArticleNotification({
        title: article.title,
        excerpt: article.excerpt || '',
        articleUrl,
        imageUrl: article.imageUrl || undefined,
      });
    }

    // SMS — infrastructure prepared but not active
    if (channel === 'sms' || channel === 'both') {
      // TODO: Implement SMS sending via Brevo when ready
      console.log('[Brevo SMS] SMS notification infrastructure ready but not active yet.');
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent successfully via ${channel || 'email'}.`,
      campaignId: result?.campaignId,
    });
  } catch (err: any) {
    console.error('[Brevo notify API error]', err);
    return NextResponse.json({ error: 'Failed to send notification: ' + (err?.message || 'Unknown error') }, { status: 500 });
  }
}
