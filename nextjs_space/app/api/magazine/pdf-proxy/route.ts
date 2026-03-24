export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const cloudPath = searchParams.get("path");

    if (!cloudPath || cloudPath.trim().length === 0) {
      return NextResponse.json({ error: "Missing path" }, { status: 400 });
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

    // Stream the response body directly instead of buffering
    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    };

    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    // Use the ReadableStream from the fetch response directly
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
