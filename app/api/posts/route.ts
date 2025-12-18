import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { content, mediaUrl, mediaType, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 });
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userId,
          name: userId.split('@')[0],
          points: 0,
          streak: 0,
        },
      });
    }

    // 创建帖子
    const post = await prisma.post.create({
      data: {
        content: content || '',
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
        userId: user.id,
      },
    });

    // 发帖奖励：+10积分
    const postReward = 10;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: user.points + postReward,
      },
    });

    return NextResponse.json({
      success: true,
      post,
      pointsEarned: postReward,
    });
  } catch (error) {
    console.error('创建帖子失败:', error);
    return NextResponse.json({ error: '创建帖子失败' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    const posts = await prisma.post.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
