export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Try Vercel Blob first (works on Vercel)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blob = await put(`uploads/${timestamp}-${safeName}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({
        url: blob.url,
        cloud_storage_path: blob.pathname,
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
      });
    }

    // Fallback: S3 presigned URL (works on Abacus AI)
    try {
      const { generatePresignedUploadUrl } = await import('@/lib/s3');
      const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
        file.name,
        file.type,
        true
      );

      // Upload to S3 from the server
      const urlObj = new URL(uploadUrl);
      const signedHeaders = urlObj.searchParams.get('X-Amz-SignedHeaders') ?? '';
      const headers: Record<string, string> = { 'Content-Type': file.type };
      if (signedHeaders.includes('content-disposition')) {
        headers['Content-Disposition'] = 'attachment';
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const s3Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: buffer,
      });

      if (!s3Res.ok) {
        throw new Error(`S3 upload failed: ${s3Res.status}`);
      }

      const fileUrl = uploadUrl.split('?')[0];
      return NextResponse.json({
        url: fileUrl,
        cloud_storage_path,
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
      });
    } catch (s3Error: any) {
      console.error('S3 fallback failed:', s3Error?.message);
      return NextResponse.json(
        { error: 'No storage configured. Please set up Vercel Blob or AWS S3.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Upload failed' },
      { status: 500 }
    );
  }
}
