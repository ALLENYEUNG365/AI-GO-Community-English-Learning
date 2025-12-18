import Link from 'next/link';
import UserNav from '@/components/UserNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              English Learning Circle
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-6 font-playfair">
            Transform Your English Learning Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join a gamified social platform where every interaction earns you points,
            builds your streak, and connects you with fellow learners worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/circle"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started
            </Link>
            <Link
              href="/learn"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-amber-500"
            >
              Explore Learning
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              10,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Active Learners
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">🔥</div>
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              50,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Daily Check-ins
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">💬</div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              100,000+
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Posts Shared
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              Daily Check-in
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Build your streak and earn bonus points for consistent learning
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              Share Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload photos and videos of your learning journey
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              AI Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Practice conversations with our intelligent AI tutor
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              Learning Hub
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access curated lessons and track your progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
