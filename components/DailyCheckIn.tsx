'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Flame, Trophy, CheckCircle, Gift } from 'lucide-react';

export default function DailyCheckIn() {
  const { data: session, status: sessionStatus } = useSession();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Check today's check-in status
  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (!session?.user?.email) {
      setIsStatusLoading(false);
      return;
    }

    let cancelled = false;

    const checkTodayStatus = async () => {
      setIsStatusLoading(true);
      try {
        const response = await fetch('/api/checkin', { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (cancelled) return;

        setHasCheckedIn(data.hasCheckedIn);
        setStreak(data.streak);
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to check check-in status:', error);
        }
      } finally {
        if (!cancelled) setIsStatusLoading(false);
      }
    };

    checkTodayStatus();

    return () => {
      cancelled = true;
    };
  }, [session, sessionStatus]);

  // Perform check-in
  const handleCheckIn = async () => {
    if (!session?.user?.email || hasCheckedIn || isStatusLoading) return;

    setIsChecking(true);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Check-in failed');
      }

      setHasCheckedIn(true);
      setStreak(data.streak);
      setTodayPoints(data.pointsEarned);
      setShowReward(true);

      setTimeout(() => {
        setShowReward(false);
      }, 3000);
    } catch (error) {
      console.error('Check-in failed:', error);
      alert(error instanceof Error ? error.message : 'Check-in failed. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  if (!session) {
    return null;
  }

  const currentStreakBonus = Math.min(Math.max(streak - 1, 0), 20);
  const nextCheckInPoints = 5 + Math.min(streak, 20);

  return (
    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 shadow-xl text-white mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Daily Check-in</h3>
              <p className="text-sm text-white/80">Check in daily and earn points</p>
            </div>
          </div>

          {streak > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Flame className="w-6 h-6" />
                {streak}
              </div>
              <p className="text-xs text-white/80">Day Streak</p>
            </div>
          )}
        </div>

        {isStatusLoading ? (
          <div className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-xl text-center font-bold text-lg">
            Checking check-in status…
          </div>
        ) : !hasCheckedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={isChecking}
            className="w-full py-4 bg-white text-amber-600 rounded-xl font-bold text-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                Checking in…
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                Check in +{nextCheckInPoints} points
              </>
            )}
          </button>
        ) : (
          <div className="py-4 bg-white/20 backdrop-blur-sm rounded-xl text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="font-bold text-lg">Already checked in today</p>
            <p className="text-sm text-white/80 mt-1">Come back tomorrow!</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/80">Base Points</p>
            <p className="font-bold">+5</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/80">Streak Bonus</p>
            <p className="font-bold">+{currentStreakBonus}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Gift className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/80">Next Check-in</p>
            <p className="font-bold">+{nextCheckInPoints}</p>
          </div>
        </div>

        <p className="text-xs text-white/60 text-center mt-3">
          Earn up to +20 bonus points for consecutive check-ins
        </p>
      </div>

      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-20 rounded-3xl">
          <div className="text-center animate-bounce">
            <Gift className="w-16 h-16 mx-auto mb-3" />
            <p className="text-2xl font-bold">+{todayPoints} points</p>
            <p className="text-sm">Check-in successful! 🎉</p>
          </div>
        </div>
      )}
    </div>
  );
}
