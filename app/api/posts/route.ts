import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const MAX_CONTENT_LENGTH = 5000;
const MAX_REQUEST_BYTES = 20 * 1024;
const MAX_POSTS_PER_MINUTE = 10;
const MAX_POSTS_PER_DAY = 100;
const ALLOWED_MEDIA_TYPES = new Set(['image', 'video']);
const ALLOWED_MEDIA_HOSTS = new Set(['res.cloudinary.com']);
const ALLOWED_MEDIA_FOLDER = '/english-learning-circle/';

function isAllowedMediaUrl(value: string, mediaType: string | null): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !ALLOWED_MEDIA_HOSTS.has(url.hostname)) {
      return false;
    }

    if (!url.pathname.includes(ALLOWED_MEDIA_FOLDER)) {
      return false;
    }

    if (mediaType === 'image' && !url.pathname.includes('/image/upload/')) {
      return false;
    }

    if (mediaType === 'video' && !url.pathname.includes('/video/upload/')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: 'User is not signed in' }, { status: 401 });
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: 'Request content is too large' }, { status: 413 });
    }

    const body = await request.json();
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const mediaUrl = typeof body.mediaUrl === 'string' ? body.mediaUrl.trim() : '';
    const mediaType = body.mediaType === null || body.mediaType === undefined
      ? null
      : String(body.mediaType);

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (mediaType !== null && !ALLOWED_MEDIA_TYPES.has(mediaType)) {
      return NextResponse.json({ error: 'Unsupported media type' }, { status: 400 });
    }

    if (mediaType && !mediaUrl) {
      return NextResponse.json({ error: 'Media URL cannot be empty' }, { status: 400 });
    }

    if (mediaUrl && !mediaType) {
      return NextResponse.json({ error: 'Media type cannot be empty' }, { status: 400 });
    }

    if (mediaUrl && !isAllowedMediaUrl(mediaUrl, mediaType)) {
      return NextResponse.json({ error: 'Media URL is not trusted' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email,
            name: session.user?.name || email.split('@')[0],
            image: session.user?.image || null,
            points: 0,
            streak: 0,
          },
        });
      }

      const now = new Date();
      const minuteAgo = new Date(now.getTime() - 60 * 1000);
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [recentPosts, dailyPosts] = await Promise.all([
        tx.post.count({
          where: { userId: user.id, createdAt: { gte: minuteAgo } },
        }),
        tx.post.count({
          where: { userId: user.id, createdAt: { gte: dayAgo } },
        }),
      ]);

      if (recentPosts >= MAX_POSTS_PER_MINUTE) {
        return { error: 'You are posting too frequently. Please try again later.' as const };
      }

      if (dailyPosts >= MAX_POSTS_PER_DAY) {
        return { error: 'You have reached the daily post limit.' as const };
      }

      const post = await tx.post.create({
        data: {
          content,
          mediaUrl: mediaUrl || null,
          mediaType,
          userId: user.id,
        },
      });

      const postReward = 10;
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { points: { increment: postReward } },
      });

      return {
        post,
        pointsEarned: postReward,
        totalPoints: updatedUser.points,
      };
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 429 });
    }

    return NextResponse.json(
      { success: true, ...result },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post. Please try again later.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '20', 10);
    const requestedSkip = Number.parseInt(searchParams.get('skip') || '0', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
    const skip = Number.isFinite(requestedSkip) ? Math.max(requestedSkip, 0) : 0;

    const posts = await prisma.post.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Failed to load post list:', error);
    return NextResponse.json({ error: 'Failed to load post list' }, { status: 500 });
  }
}
