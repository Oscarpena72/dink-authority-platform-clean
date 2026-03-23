export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { generatePresignedUploadUrl } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const fileName = body?.fileName ?? 'file';
    const contentType = body?.contentType ?? 'application/octet-stream';
    const isPublic = body?.isPublic ?? true;
    const result = await generatePresignedUploadUrl(fileName, contentType, isPublic);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
