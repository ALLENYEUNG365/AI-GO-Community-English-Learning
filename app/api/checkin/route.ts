import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: '缺少用户邮箱' }, { status: 400 });
    }

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          points: 0,
          streak: 0,
        },
      });
    }

    // 检查今天是否已经签到
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json({ error: '今日已签到' }, { status: 400 });
    }

    // 计算连续签到天数
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    // 更新连续签到天数
    let newStreak = 1;
    if (yesterdayCheckIn) {
      newStreak = user.streak + 1;
    }

    // 计算积分：基础5分 + 连续天数奖励（最高20分）
    const basePoints = 5;
    const streakBonus = Math.min(newStreak - 1, 20);
    const totalPoints = basePoints + streakBonus;

    // 创建签到记录
    await prisma.checkIn.create({
      data: {
        userId: user.id,
        points: totalPoints,
      },
    });

    // 更新用户积分和连续天数
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        points: user.points + totalPoints,
        streak: newStreak,
      },
    });

    return NextResponse.json({
      success: true,
      streak: newStreak,
      pointsEarned: totalPoints,
      totalPoints: updatedUser.points,
    });
  } catch (error) {
    console.error('签到失败:', error);
    return NextResponse.json({ error: '签到失败' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: '缺少用户邮箱' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        hasCheckedIn: false,
        streak: 0,
      });
    }

    // 检查今天是否已签到
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    });

    return NextResponse.json({
      hasCheckedIn: !!todayCheckIn,
      streak: user.streak,
    });
  } catch (error) {
    console.error('获取签到状态失败:', error);
    return NextResponse.json({ error: '获取签到状态失败' }, { status: 500 });
  }
}
