'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Trophy, Flame, Star, Settings, LogOut, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import UserNav from '@/components/UserNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function MePage() {
  const { data: session } = useSession();

  const stats = [
    { label: 'Total Points', value: '8,960', icon: Trophy, color: 'text-amber-600' },
    { label: 'Day Streak', value: '30', icon: Flame, color: 'text-orange-600' },
    { label: 'Achievements', value: '12', icon: Star, color: 'text-yellow-600' },
  ];

  const achievements = [
    { id: 1, name: 'Early Bird', progress: 100, total: 100, unlocked: true },
    { id: 2, name: 'Social Butterfly', progress: 45, total: 100, unlocked: false },
    { id: 3, name: 'Vocabulary Master', progress: 250, total: 500, unlocked: false },
    { id: 4, name: 'Persistent Learner', progress: 30, total: 30, unlocked: true },
  ];

  const menuItems = [
    { label: 'Edit Profile', icon: Settings },
    { label: 'Learning Stats', icon: Trophy },
    { label: 'Achievements', icon: Star },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            My Profile
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-8 shadow-lg mb-6 text-white">
          <div className="flex items-center gap-6">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={80}
                height={80}
                className="rounded-full ring-4 ring-white/50"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {session?.user?.name || 'Guest User'}
              </h2>
              <p className="text-white/80 text-sm mb-3">
                {session?.user?.email || 'Please sign in'}
              </p>
              <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                Level 8
              </div>
            </div>
          </div>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md text-center"
              >
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* 成就展示 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Achievements
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <Trophy
                    className={`w-6 h-6 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {achievement.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.progress}/{achievement.total}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                      style={{
                        width: `${(achievement.progress / achievement.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 菜单选项 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-lg">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-amber-50 dark:hover:bg-gray-700 rounded-xl transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
