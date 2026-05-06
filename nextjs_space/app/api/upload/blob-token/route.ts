export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (/* pathname */) => {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          throw new Error('Unauthorized');
        }
        return {
          allowedContentTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
          ],
          tokenPayload: JSON.stringify({ userId: (session.user as any)?.id ?? 'unknown' }),
        };
      },
      onUploadCompleted: async ({ blob }: { blob: any }) => {
        // Optional: save to DB or log
        console.log('[blob-upload] completed:', blob.url, blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('[blob-token] error:', error?.message);
    return NextResponse.json(
      { error: error?.message ?? 'Upload token generation failed' },
      { status: 400 }
    );
  }
}
