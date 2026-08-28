import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    const result = await prisma.$transaction(
      async (tx) => {
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

        // The application currently treats the database/server local day as the check-in day.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingCheckIn = await tx.checkIn.findFirst({
          where: {
            userId: user.id,
            createdAt: { gte: today },
          },
        });

        if (existingCheckIn) {
          return { error: '今日已签到' as const };
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayCheckIn = await tx.checkIn.findFirst({
          where: {
            userId: user.id,
            createdAt: {
              gte: yesterday,
              lt: today,
            },
          },
        });

        const newStreak = yesterdayCheckIn ? user.streak + 1 : 1;
        const streakBonus = Math.min(Math.max(newStreak - 1, 0), 20);
        const totalPoints = 5 + streakBonus;

        await tx.checkIn.create({
          data: {
            userId: user.id,
            points: totalPoints,
          },
        });

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            points: { increment: totalPoints },
            streak: newStreak,
          },
        });

        return {
          success: true as const,
          streak: newStreak,
          pointsEarned: totalPoints,
          totalPoints: updatedUser.points,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('签到失败:', error);
    return NextResponse.json({ error: '签到失败，请稍后重试' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCheckIn = await prisma.checkIn.findFirst({
      where: {
        userId: user.id,
        createdAt: { gte: today },
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
