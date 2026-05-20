export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { sendArticleNotification, sendBulkSms, buildArticleSmsMessage, isSmsEnabled, getBrevoListPhoneNumbers } from '@/lib/brevo';

/**
 * POST /api/brevo/notify — Send article notification to subscribers via Brevo.
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

    let emailResult: any = null;
    let smsResult: any = null;

    // Email notification
    if (channel === 'email' || channel === 'both') {
      emailResult = await sendArticleNotification({
        title: article.title,
        excerpt: article.excerpt || '',
        articleUrl,
        imageUrl: article.imageUrl || undefined,
      });
    }

    // SMS notification (graceful — never blocks email in 'both' mode)
    if (channel === 'sms' || channel === 'both') {
      try {
        if (!isSmsEnabled()) {
          smsResult = { sent: 0, failed: 0, reason: 'SMS not available — SMS is not enabled in server configuration.' };
        } else {
          // Fetch phone numbers from Brevo List (contacts with SMS attribute)
          const allPhones = await getBrevoListPhoneNumbers();

          if (allPhones.length === 0) {
            smsResult = { sent: 0, failed: 0, reason: 'No contacts with phone numbers found in Brevo list.' };
          } else {
            const smsMessage = buildArticleSmsMessage(article.title, articleUrl);
            smsResult = await sendBulkSms({
              recipients: allPhones,
              content: smsMessage,
              tag: 'article-notification',
            });
          }
        }
      } catch (smsErr: any) {
        console.error('[Brevo notify] SMS error (non-blocking):', smsErr?.message);
        smsResult = { sent: 0, failed: 0, reason: 'SMS delivery failed — unexpected error.' };
      }
    }

    // Build response message
    const parts: string[] = [];
    if (channel === 'email' || channel === 'both') {
      parts.push(emailResult?.campaignId ? 'Email campaign sent' : 'Email sent');
    }
    if (channel === 'sms' || channel === 'both') {
      if (smsResult?.reason) {
        parts.push(`SMS: ${smsResult.reason}`);
      } else if (smsResult) {
        parts.push(`SMS sent to ${smsResult.sent} recipient(s)${smsResult.failed ? `, ${smsResult.failed} failed` : ''}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: parts.join('. ') + '.',
      campaignId: emailResult?.campaignId,
      smsResult,
    });
  } catch (err: any) {
    console.error('[Brevo notify API error]', err);
    return NextResponse.json({ error: 'Failed to send notification: ' + (err?.message || 'Unknown error') }, { status: 500 });
  }
}
