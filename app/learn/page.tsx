'use client';

import { BookOpen, Video, FileText, Headphones, Award } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import UserNav from '@/components/UserNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function LearnPage() {
  const learningModules = [
    {
      id: 1,
      icon: Video,
      title: 'Video Lessons',
      description: 'Watch engaging video lessons to improve your English',
      lessons: 24,
      progress: 65,
      color: 'from-red-400 to-pink-500',
    },
    {
      id: 2,
      icon: FileText,
      title: 'Reading Practice',
      description: 'Enhance your reading skills with interesting articles',
      lessons: 18,
      progress: 45,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 3,
      icon: Headphones,
      title: 'Listening Exercises',
      description: 'Train your ear with audio exercises and podcasts',
      lessons: 32,
      progress: 80,
      color: 'from-purple-400 to-indigo-500',
    },
    {
      id: 4,
      icon: Award,
      title: 'Grammar Challenges',
      description: 'Master English grammar through interactive quizzes',
      lessons: 15,
      progress: 30,
      color: 'from-green-400 to-emerald-500',
    },
  ];

  const recentLessons = [
    { id: 1, title: 'Present Perfect Tense', type: 'Grammar', duration: '15 min' },
    { id: 2, title: 'Business English Vocabulary', type: 'Vocabulary', duration: '20 min' },
    { id: 3, title: 'Pronunciation Practice', type: 'Speaking', duration: '10 min' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Learn
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 学习进度概览 */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Your Learning Journey
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Overall Progress</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full transition-all"
                  style={{ width: '55%' }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">55%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Complete</p>
            </div>
          </div>
        </div>

        {/* 学习模块 */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Learning Modules
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {learningModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {module.lessons} lessons
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {module.progress}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 最近学习 */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Continue Learning
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 bg-amber-50 dark:bg-gray-700 rounded-xl hover:bg-amber-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {lesson.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    {lesson.duration}
                  </p>
                  <button className="text-xs text-amber-500 hover:text-amber-600 font-semibold">
                    Continue →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
