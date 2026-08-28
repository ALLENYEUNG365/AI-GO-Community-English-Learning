import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const CHECKIN_TIMEZONE = process.env.CHECKIN_TIMEZONE || 'Asia/Shanghai';

function getCheckInDate(): Date {
  const dateKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: CHECKIN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  return new Date(`${dateKey}T00:00:00.000Z`);
}

function getYesterday(date: Date): Date {
  return new Date(date.getTime() - 24 * 60 * 60 * 1000);
}

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

        const today = getCheckInDate();
        const yesterday = getYesterday(today);

        const existingCheckIn = await tx.checkIn.findUnique({
          where: {
            userId_checkInDate: {
              userId: user.id,
              checkInDate: today,
            },
          },
        });

        if (existingCheckIn) {
          return { error: '今日已签到' as const };
        }

        const yesterdayCheckIn = await tx.checkIn.findUnique({
          where: {
            userId_checkInDate: {
              userId: user.id,
              checkInDate: yesterday,
            },
          },
        });

        const newStreak = yesterdayCheckIn ? user.streak + 1 : 1;
        const streakBonus = Math.min(Math.max(newStreak - 1, 0), 20);
        const totalPoints = 5 + streakBonus;

        await tx.checkIn.create({
          data: {
            userId: user.id,
            checkInDate: today,
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

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: '今日已签到' }, { status: 400 });
    }

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
      }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const today = getCheckInDate();

    const todayCheckIn = await prisma.checkIn.findUnique({
      where: {
        userId_checkInDate: {
          userId: user.id,
          checkInDate: today,
        },
      },
    });

    return NextResponse.json({
      hasCheckedIn: !!todayCheckIn,
      streak: user.streak,
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('获取签到状态失败:', error);
    return NextResponse.json({ error: '获取签到状态失败' }, { status: 500 });
  }
}
