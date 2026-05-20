/**
 * Brevo (formerly Sendinblue) integration — server-side only.
 * NEVER import this file in client components.
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || '3', 10);
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'contact@dinkauthoritymagazine.com';
const DEFAULT_FROM_NAME = process.env.DEFAULT_FROM_NAME || 'Dink Authority Magazine';
const BREVO_BASE = 'https://api.brevo.com/v3';

interface BrevoContact {
  email: string;
  phone?: string | null;
  name?: string | null;
  source?: string;
  subscribedAt?: string;
}

interface BrevoEmailRecipient {
  email: string;
  name?: string;
}

async function brevoFetch(path: string, body: Record<string, any>) {
  if (!BREVO_API_KEY) {
    console.warn('[Brevo] API key not configured — skipping request to', path);
    return null;
  }
  try {
    const res = await fetch(`${BREVO_BASE}${path}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[Brevo] ${path} failed (${res.status}):`, text);
      return null;
    }
    // Some Brevo endpoints return 204 No Content
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await res.json();
    }
    return { ok: true };
  } catch (err: any) {
    console.error(`[Brevo] ${path} error:`, err?.message);
    return null;
  }
}

/**
 * Create or update a contact in Brevo and add to the Dink Readers list.
 * Uses updateEnabled=true to avoid duplicates.
 */
export async function syncContactToBrevo(contact: BrevoContact) {
  const attributes: Record<string, any> = {};
  if (contact.phone) attributes.SMS = contact.phone;
  if (contact.name) attributes.FIRSTNAME = contact.name;
  if (contact.source) attributes.SOURCE = contact.source;
  if (contact.subscribedAt) attributes.SUBSCRIBED_AT = contact.subscribedAt;

  return brevoFetch('/contacts', {
    email: contact.email,
    attributes,
    listIds: [BREVO_LIST_ID],
    updateEnabled: true,
  });
}

/**
 * Sync a batch of contacts to Brevo (one by one with updateEnabled).
 * Returns { synced, failed } counts.
 */
export async function syncBatchToBrevo(contacts: BrevoContact[]) {
  let synced = 0;
  let failed = 0;
  for (const contact of contacts) {
    const result = await syncContactToBrevo(contact);
    if (result !== null) {
      synced++;
    } else {
      failed++;
    }
    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 100));
  }
  return { synced, failed };
}

/**
 * Send a transactional welcome email to a new subscriber.
 */
export async function sendWelcomeEmail(to: BrevoEmailRecipient) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;border-bottom:2px solid #39ff14;">
              <h1 style="color:#39ff14;font-size:28px;margin:0 0 8px;font-weight:800;letter-spacing:-0.5px;">DINK AUTHORITY</h1>
              <p style="color:#ffffff;font-size:11px;letter-spacing:4px;margin:0;text-transform:uppercase;">THE VOICE OF PICKLEBALL™</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#ffffff;font-size:24px;margin:0 0 20px;font-weight:700;">Welcome to The Voice of Pickleball™</h2>
              <p style="color:#b0b0c0;font-size:16px;line-height:1.7;margin:0 0 24px;">
                You're now part of the Dink Authority community — where pickleball stories, players, tournaments and culture come together.
              </p>
              <p style="color:#b0b0c0;font-size:16px;line-height:1.7;margin:0 0 16px;">Stay tuned for:</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 30px;">
                <tr><td style="padding:6px 0;color:#39ff14;font-size:14px;">🏓</td><td style="padding:6px 12px;color:#e0e0e0;font-size:15px;">Breaking news</td></tr>
                <tr><td style="padding:6px 0;color:#39ff14;font-size:14px;">📰</td><td style="padding:6px 12px;color:#e0e0e0;font-size:15px;">Exclusive stories</td></tr>
                <tr><td style="padding:6px 0;color:#39ff14;font-size:14px;">⭐</td><td style="padding:6px 12px;color:#e0e0e0;font-size:15px;">Player features</td></tr>
                <tr><td style="padding:6px 0;color:#39ff14;font-size:14px;">📖</td><td style="padding:6px 12px;color:#e0e0e0;font-size:15px;">Magazine releases</td></tr>
                <tr><td style="padding:6px 0;color:#39ff14;font-size:14px;">🏆</td><td style="padding:6px 12px;color:#e0e0e0;font-size:15px;">Event coverage</td></tr>
                <tr><td style="padding:6px 0;color:#39ff14;font-size:14px;">🤝</td><td style="padding:6px 12px;color:#e0e0e0;font-size:15px;">Community updates</td></tr>
              </table>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://dinkauthoritymagazine.com" style="display:inline-block;background-color:#39ff14;color:#0f0f1a;font-weight:800;font-size:14px;text-decoration:none;padding:14px 36px;border-radius:8px;text-transform:uppercase;letter-spacing:1px;">Visit Dink Authority</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:#12122a;text-align:center;border-top:1px solid #ffffff10;">
              <p style="color:#666;font-size:12px;margin:0 0 4px;">Dink Authority Magazine</p>
              <p style="color:#39ff14;font-size:11px;letter-spacing:3px;margin:0;text-transform:uppercase;">THE VOICE OF PICKLEBALL™</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return brevoFetch('/smtp/email', {
    sender: { name: DEFAULT_FROM_NAME, email: DEFAULT_FROM_EMAIL },
    to: [{ email: to.email, name: to.name || to.email }],
    subject: 'Welcome to The Voice of Pickleball™',
    htmlContent,
    tags: ['welcome-email'],
  });
}

/**
 * Send an article notification email to a list of recipients via Brevo campaign-style.
 * Uses transactional email to the entire Brevo list.
 */
export async function sendArticleNotification(opts: {
  title: string;
  excerpt: string;
  articleUrl: string;
  imageUrl?: string;
}) {
  const { title, excerpt, articleUrl, imageUrl } = opts;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a2e;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:30px 40px 16px;text-align:center;border-bottom:2px solid #39ff14;">
              <h1 style="color:#39ff14;font-size:22px;margin:0 0 4px;font-weight:800;">DINK AUTHORITY</h1>
              <p style="color:#ffffff;font-size:10px;letter-spacing:3px;margin:0;text-transform:uppercase;">NEW ON THE VOICE OF PICKLEBALL™</p>
            </td>
          </tr>
          ${imageUrl ? `<tr><td><img src="${imageUrl}" alt="${title}" style="width:100%;height:auto;display:block;" /></td></tr>` : ''}
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;font-weight:700;line-height:1.3;">${title}</h2>
              <p style="color:#b0b0c0;font-size:15px;line-height:1.7;margin:0 0 28px;">${excerpt || ''}</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${articleUrl}" style="display:inline-block;background-color:#39ff14;color:#0f0f1a;font-weight:800;font-size:14px;text-decoration:none;padding:14px 36px;border-radius:8px;text-transform:uppercase;letter-spacing:1px;">Read More</a>
                  </td>
                </tr>
              </table>
              <p style="color:#666;font-size:13px;line-height:1.6;margin:24px 0 0;text-align:center;">
                Help grow pickleball — share this story with your friends, club or favorite pickleball group.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#12122a;text-align:center;border-top:1px solid #ffffff10;">
              <p style="color:#666;font-size:12px;margin:0 0 4px;">Dink Authority Magazine</p>
              <p style="color:#39ff14;font-size:11px;letter-spacing:3px;margin:0;text-transform:uppercase;">THE VOICE OF PICKLEBALL™</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Send as a campaign to the Brevo list via email campaign API
  // First, create the campaign, then send it
  const campaignResult = await brevoFetch('/emailCampaigns', {
    name: `Article: ${title} — ${new Date().toISOString().slice(0, 10)}`,
    subject: `New on Dink Authority: ${title}`,
    sender: { name: DEFAULT_FROM_NAME, email: DEFAULT_FROM_EMAIL },
    htmlContent,
    recipients: { listIds: [BREVO_LIST_ID] },
    tags: ['article-notification'],
  });

  if (!campaignResult?.id) {
    console.error('[Brevo] Failed to create campaign');
    return null;
  }

  // Now send the campaign immediately
  const sendResult = await brevoFetch(`/emailCampaigns/${campaignResult.id}/sendNow`, {});
  return { campaignId: campaignResult.id, sendResult };
}

/* ─── SMS ─────────────────────────────────────────────────────── */

const BREVO_SMS_SENDER = process.env.BREVO_SMS_SENDER || 'DINKAUTH';
const SMS_ENABLED = process.env.SMS_ENABLED === 'true';

/**
 * Check whether SMS sending is enabled and configured.
 */
export function isSmsEnabled(): boolean {
  return SMS_ENABLED && !!BREVO_API_KEY;
}

/**
 * Send a single transactional SMS via Brevo.
 * recipient must be in international format, e.g. +1XXXXXXXXXX
 */
export async function sendTransactionalSms(opts: {
  recipient: string;
  content: string;
  tag?: string;
}): Promise<{ ok: boolean; reason?: string; messageId?: string; reference?: string; noCredits?: boolean }> {
  if (!isSmsEnabled()) {
    console.warn('[Brevo SMS] SMS is not enabled or API key missing.');
    return { ok: false, reason: 'SMS not enabled' };
  }
  if (!BREVO_API_KEY) {
    return { ok: false, reason: 'Brevo API key not configured' };
  }
  const { recipient, content, tag } = opts;
  try {
    const res = await fetch(`${BREVO_BASE}/transactionalSMS/sms`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: BREVO_SMS_SENDER,
        recipient,
        content,
        type: 'transactional',
        ...(tag ? { tag } : {}),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[Brevo SMS] Send failed (${res.status}):`, text);
      // Detect insufficient credits / payment required errors
      const lower = text.toLowerCase();
      if (res.status === 402 || lower.includes('insufficient') || lower.includes('credit') || lower.includes('payment')) {
        return { ok: false, reason: 'SMS not available — Brevo SMS credits required.', noCredits: true };
      }
      return { ok: false, reason: `Brevo SMS error (${res.status})` };
    }
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await res.json();
      return { ok: true, messageId: data?.messageId, reference: data?.reference };
    }
    return { ok: true };
  } catch (err: any) {
    console.error('[Brevo SMS] Network error:', err?.message);
    return { ok: false, reason: 'SMS delivery failed — network error' };
  }
}

/**
 * Send SMS to multiple recipients sequentially.
 * Returns { sent, failed } counts.
 */
export async function sendBulkSms(opts: {
  recipients: string[];
  content: string;
  tag?: string;
}): Promise<{ sent: number; failed: number; reason?: string }> {
  if (!isSmsEnabled()) {
    return { sent: 0, failed: 0, reason: 'SMS not enabled' };
  }
  let sent = 0;
  let failed = 0;
  for (const recipient of opts.recipients) {
    const result = await sendTransactionalSms({
      recipient,
      content: opts.content,
      tag: opts.tag,
    });
    if (result.ok) {
      sent++;
    } else {
      failed++;
      // If no credits, stop immediately — no point trying more recipients
      if (result.noCredits) {
        console.warn('[Brevo SMS] No SMS credits — aborting bulk send.');
        return { sent, failed: opts.recipients.length - sent, reason: 'SMS not available — Brevo SMS credits required.' };
      }
    }
    // Rate-limit: ~100ms between sends
    await new Promise((r) => setTimeout(r, 100));
  }
  return { sent, failed };
}

/**
 * Build a Dink Authority Alert SMS message for an article.
 * Target: ≤160 chars when possible.
 */
export function buildArticleSmsMessage(title: string, url: string): string {
  const prefix = 'Dink Authority Alert: ';
  const suffix = ` Read now: ${url}`;
  const maxTitleLen = 160 - prefix.length - suffix.length;
  const truncatedTitle = title.length > maxTitleLen
    ? title.slice(0, maxTitleLen - 1) + '…'
    : title;
  return `${prefix}${truncatedTitle}${suffix}`;
}

/**
 * Get all contacts from a Brevo list (for admin display/stats).
 */
export async function getBrevoListStats() {
  if (!BREVO_API_KEY) return null;
  try {
    const res = await fetch(`${BREVO_BASE}/contacts/lists/${BREVO_LIST_ID}`, {
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch all contacts with valid SMS phone numbers from Brevo List.
 * Uses pagination (max 500 per page) to get all contacts.
 * Returns array of phone strings in international format.
 */
export async function getBrevoListPhoneNumbers(listId?: number): Promise<string[]> {
  if (!BREVO_API_KEY) {
    console.warn('[Brevo] API key not configured — cannot fetch phone numbers');
    return [];
  }

  const targetList = listId ?? BREVO_LIST_ID;
  const phones: string[] = [];
  let offset = 0;
  const limit = 500; // max allowed by Brevo
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(
        `${BREVO_BASE}/contacts/lists/${targetList}/contacts?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
          },
        }
      );

      if (!res.ok) {
        console.error(`[Brevo] Failed to fetch list contacts: ${res.status} ${res.statusText}`);
        break;
      }

      const data = await res.json();
      const contacts = data.contacts || [];

      for (const contact of contacts) {
        // SMS attribute holds phone number in Brevo
        const sms = contact.attributes?.SMS;
        if (sms && !contact.smsBlacklisted) {
          // Normalize: ensure + prefix for international format
          const normalized = String(sms).startsWith('+') ? String(sms) : `+${sms}`;
          phones.push(normalized);
        }
      }

      // Check if more pages exist
      if (contacts.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }

      // Safety: cap at 10k contacts to prevent runaway pagination
      if (offset >= 10000) {
        console.warn('[Brevo] Hit 10k contact limit, stopping pagination');
        hasMore = false;
      }
    } catch (err) {
      console.error('[Brevo] Error fetching list contacts:', err);
      break;
    }
  }

  console.log(`[Brevo SMS] Found ${phones.length} phone number(s) in list ${targetList}`);
  return phones;
}
