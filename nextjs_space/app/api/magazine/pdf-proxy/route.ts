export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/db";

function createS3Client() {
  return new S3Client({});
}

function getBucketConfig() {
  return {
    bucketName: process.env.AWS_BUCKET_NAME ?? "",
    folderPrefix: process.env.AWS_FOLDER_PREFIX ?? "",
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let cloudPath = searchParams.get("path");
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    // If no direct path provided, look up from database
    if (!cloudPath || cloudPath.trim().length === 0) {
      let edition;
      if (slug) {
        edition = await prisma.magazineEdition.findFirst({ where: { slug } });
      } else if (id) {
        edition = await prisma.magazineEdition.findUnique({ where: { id } });
      }

      if (!edition) {
        return NextResponse.json({ error: "Edition not found" }, { status: 404 });
      }

      cloudPath = edition.pdfCloudPath ?? null;
      if (!cloudPath || cloudPath.trim().length === 0) {
        return NextResponse.json({ error: "No PDF available" }, { status: 404 });
      }
    }

    const s3 = createS3Client();
    const { bucketName } = getBucketConfig();

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: cloudPath,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    // Fetch the PDF from S3 using the signed URL
    const s3Response = await fetch(signedUrl);

    if (!s3Response.ok) {
      console.error("S3 fetch failed:", s3Response.status, s3Response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch PDF from storage" },
        { status: 502 }
      );
    }

    const contentLength = s3Response.headers.get("content-length");

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    };

    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    // Stream the response body directly
    if (s3Response.body) {
      return new Response(s3Response.body, {
        status: 200,
        headers,
      });
    }

    // Fallback: buffer if streaming not available
    const arrayBuffer = await s3Response.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        ...headers,
        "Content-Length": String(arrayBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("PDF proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
