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

function isAllowedMediaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ALLOWED_MEDIA_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: '请求内容过大' }, { status: 413 });
    }

    const body = await request.json();
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    const mediaUrl = typeof body.mediaUrl === 'string' ? body.mediaUrl.trim() : '';
    const mediaType = body.mediaType === null || body.mediaType === undefined
      ? null
      : String(body.mediaType);

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `内容不能超过 ${MAX_CONTENT_LENGTH} 个字符` },
        { status: 400 }
      );
    }

    if (mediaType !== null && !ALLOWED_MEDIA_TYPES.has(mediaType)) {
      return NextResponse.json({ error: '不支持的媒体类型' }, { status: 400 });
    }

    if (mediaType && !mediaUrl) {
      return NextResponse.json({ error: '媒体地址不能为空' }, { status: 400 });
    }

    if (mediaUrl && !isAllowedMediaUrl(mediaUrl)) {
      return NextResponse.json({ error: '媒体地址不受信任' }, { status: 400 });
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
        return { error: '发布过于频繁，请稍后再试' as const };
      }

      if (dailyPosts >= MAX_POSTS_PER_DAY) {
        return { error: '今日发布次数已达到上限' as const };
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
    console.error('创建帖子失败:', error);
    return NextResponse.json({ error: '创建帖子失败，请稍后重试' }, { status: 500 });
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
    console.error('获取帖子列表失败:', error);
    return NextResponse.json({ error: '获取帖子列表失败' }, { status: 500 });
  }
}
