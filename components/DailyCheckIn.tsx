'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, Flame, Trophy, CheckCircle, Gift } from 'lucide-react';

export default function DailyCheckIn() {
  const { data: session } = useSession();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [todayPoints, setTodayPoints] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // 检查今日是否已签到
  useEffect(() => {
    if (!session?.user?.email) return;

    const checkTodayStatus = async () => {
      try {
        const response = await fetch(`/api/checkin/status?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setHasCheckedIn(data.hasCheckedIn);
          setStreak(data.streak);
        }
      } catch (error) {
        console.error('检查签到状态失败:', error);
      }
    };

    checkTodayStatus();
  }, [session]);

  // 执行签到
  const handleCheckIn = async () => {
    if (!session?.user?.email || hasCheckedIn) return;

    setIsChecking(true);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('签到失败');
      }

      const data = await response.json();
      
      // 更新状态
      setHasCheckedIn(true);
      setStreak(data.streak);
      setTodayPoints(data.pointsEarned);
      setShowReward(true);

      // 3秒后隐藏奖励提示
      setTimeout(() => {
        setShowReward(false);
      }, 3000);
    } catch (error) {
      console.error('签到失败:', error);
      alert('签到失败，请重试');
    } finally {
      setIsChecking(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 shadow-xl text-white mb-6 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

      <div className="relative z-10">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">每日签到</h3>
              <p className="text-sm text-white/80">坚持打卡，获取积分奖励</p>
            </div>
          </div>
          
          {/* 连续签到天数 */}
          {streak > 0 && (
            <div className="text-center">
              <div className="flex items-center gap-1 text-2xl font-bold">
                <Flame className="w-6 h-6" />
                {streak}
              </div>
              <p className="text-xs text-white/80">连续天数</p>
            </div>
          )}
        </div>

        {/* 签到按钮 */}
        {!hasCheckedIn ? (
          <button
            onClick={handleCheckIn}
            disabled={isChecking}
            className="w-full py-4 bg-white text-amber-600 rounded-xl font-bold text-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <>
                <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                签到中...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                立即签到 +{5 + Math.min(streak, 20)}积分
              </>
            )}
          </button>
        ) : (
          <div className="py-4 bg-white/20 backdrop-blur-sm rounded-xl text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2" />
            <p className="font-bold text-lg">今日已签到</p>
            <p className="text-sm text-white/80 mt-1">明天再来吧！</p>
          </div>
        )}

        {/* 积分说明 */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/80">基础积分</p>
            <p className="font-bold">+5</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Flame className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/80">连续奖励</p>
            <p className="font-bold">+{Math.min(streak, 20)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <Gift className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/80">今日总计</p>
            <p className="font-bold">+{5 + Math.min(streak, 20)}</p>
          </div>
        </div>

        <p className="text-xs text-white/60 text-center mt-3">
          连续签到最高可额外获得 +20 积分
        </p>
      </div>

      {/* 奖励动画 */}
      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-20 rounded-3xl">
          <div className="text-center animate-bounce">
            <Gift className="w-16 h-16 mx-auto mb-3" />
            <p className="text-2xl font-bold">+{todayPoints} 积分</p>
            <p className="text-sm">签到成功！🎉</p>
          </div>
        </div>
      )}
    </div>
  );
}
