export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { csvResponse } from '@/lib/csv-export';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, city, state, address, zipCode, phone, email, facebookUrl, instagramUrl, tiktokUrl, message } = data ?? {};

    if (!firstName || !lastName || !city || !state || !email) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const record = await prisma.communityCorrespondent.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        city: city.trim(),
        state: state.trim(),
        address: address?.trim() || null,
        zipCode: zipCode?.trim() || null,
        phone: phone?.trim() || null,
        email: email.trim().toLowerCase(),
        facebookUrl: facebookUrl?.trim() || null,
        instagramUrl: instagramUrl?.trim() || null,
        tiktokUrl: tiktokUrl?.trim() || null,
        message: message?.trim() || null,
      },
    });

    // Send email notification
    try {
      const appUrl = process.env.NEXTAUTH_URL || '';
      const appName = 'Dink Authority Magazine';
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D1B69; border-bottom: 3px solid #CCFF00; padding-bottom: 10px;">New Community Correspondent Registration</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p style="margin: 8px 0;"><strong>City:</strong> ${city}</p>
            <p style="margin: 8px 0;"><strong>State:</strong> ${state}</p>
            <p style="margin: 8px 0;"><strong>Address:</strong> ${address || 'N/A'}</p>
            <p style="margin: 8px 0;"><strong>Zip Code:</strong> ${zipCode || 'N/A'}</p>
          </div>
          ${(facebookUrl || instagramUrl || tiktokUrl) ? `<div style="background: #f0f0ff; padding: 15px; border-radius: 8px; margin: 15px 0;"><h3 style="color: #2D1B69; margin-top: 0;">Social Media</h3>${facebookUrl ? `<p style="margin: 5px 0;"><strong>Facebook:</strong> <a href="${facebookUrl}">${facebookUrl}</a></p>` : ''}${instagramUrl ? `<p style="margin: 5px 0;"><strong>Instagram:</strong> <a href="${instagramUrl}">${instagramUrl}</a></p>` : ''}${tiktokUrl ? `<p style="margin: 5px 0;"><strong>TikTok:</strong> <a href="${tiktokUrl}">${tiktokUrl}</a></p>` : ''}</div>` : ''}
          ${message ? `<div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #CCFF00; margin: 15px 0;"><h3 style="color: #2D1B69; margin-top: 0;">Message</h3><p>${message}</p></div>` : ''}
          <p style="color: #666; font-size: 12px;">Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `;

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_COMMUNITY_CORRESPONDENT_REGISTRATION,
          subject: `New Community Correspondent: ${firstName} ${lastName} (${city}, ${state})`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'contact@dinkauthoritymagazine.com',
          sender_alias: appName,
        }),
      });
    } catch (emailErr) {
      console.error('Email notification error:', emailErr);
    }

    return NextResponse.json({ success: true, id: record.id });
  } catch (error: any) {
    console.error('Community registration error:', error);
    return NextResponse.json({ success: false, message: 'Failed to register' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    const records = await prisma.communityCorrespondent.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'City', 'State', 'Address', 'Zip Code', 'Facebook', 'Instagram', 'TikTok', 'Message', 'Status', 'Date'];
      const rows = records.map((r: any) => [
        r.firstName, r.lastName, r.email, r.phone || '', r.city, r.state,
        r.address || '', r.zipCode || '', r.facebookUrl || '', r.instagramUrl || '',
        r.tiktokUrl || '', (r.message || '').replace(/[\n\r]+/g, ' '), r.status,
        new Date(r.createdAt).toISOString(),
      ]);
      return csvResponse(headers, rows, 'community_correspondents');
    }

    return NextResponse.json(records);
  } catch (error: any) {
    console.error('Community GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}
