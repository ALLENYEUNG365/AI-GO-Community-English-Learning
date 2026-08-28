import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const ALLOWED_RESOURCE_TYPES = new Set(['image', 'video']);
const ALLOWED_FORMATS = {
  image: 'jpg,jpeg,png,gif,webp',
  video: 'mp4,mov,webm',
} as const;
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
} as const;
const CLOUDINARY_FOLDER = 'english-learning-circle';

// Defense-in-depth rate limiting for the signature endpoint.
// This is intentionally kept dependency-free. On serverless platforms the
// limiter is per running instance, so it reduces abuse but is not a global quota.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_SIGNATURES_PER_WINDOW = 10;
const signatureRequests = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recentRequests = (signatureRequests.get(key) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentRequests.length >= MAX_SIGNATURES_PER_WINDOW) {
    signatureRequests.set(key, recentRequests);
    return true;
  }

  recentRequests.push(now);
  signatureRequests.set(key, recentRequests);

  // Prevent an unbounded in-memory map on long-lived instances.
  if (signatureRequests.size > 5000) {
    for (const [entryKey, timestamps] of signatureRequests) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        signatureRequests.delete(entryKey);
      }
    }
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'User is not signed in' }, { status: 401 });
    }

    // Rate-limit by authenticated account rather than client IP so changing
    // networks cannot trivially bypass the upload-signature quota.
    if (isRateLimited(email)) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please try again in a minute.' },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': '60',
          },
        }
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary server configuration is incomplete');
      return NextResponse.json({ error: 'Upload service configuration is incomplete' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const resourceType = typeof body.resourceType === 'string' ? body.resourceType : '';
    const fileSize = typeof body.fileSize === 'number' ? body.fileSize : Number(body.fileSize);

    if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
      return NextResponse.json({ error: 'Unsupported upload type' }, { status: 400 });
    }

    const maxFileSize = MAX_FILE_SIZES[resourceType as keyof typeof MAX_FILE_SIZES];

    if (!Number.isSafeInteger(fileSize) || fileSize <= 0) {
      return NextResponse.json({ error: 'A valid file size is required' }, { status: 400 });
    }

    if (fileSize > maxFileSize) {
      return NextResponse.json(
        {
          error: `File is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB.`,
          maxFileSize,
        },
        { status: 413 }
      );
    }

    const allowedFormats = ALLOWED_FORMATS[resourceType as keyof typeof ALLOWED_FORMATS];
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `allowed_formats=${allowedFormats}&folder=${CLOUDINARY_FOLDER}&timestamp=${timestamp}`;
    const signature = createHash('sha1')
      .update(`${paramsToSign}${apiSecret}`)
      .digest('hex');

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder: CLOUDINARY_FOLDER,
      allowedFormats,
      maxFileSize,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Failed to generate upload signature:', error);
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 });
  }
}
