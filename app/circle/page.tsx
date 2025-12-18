'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Trophy } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import UserNav from '@/components/UserNav';
import ThemeToggle from '@/components/ThemeToggle';
import DailyCheckIn from '@/components/DailyCheckIn';
import CreatePost from '@/components/CreatePost';

type Post = {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    image?: string;
  };
};

export default function CirclePage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载帖子
  const loadPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('加载帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 计算时间差
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}秒前`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    return `${Math.floor(seconds / 86400)}天前`;
  };

  const hotTopics = [
    { id: 1, name: 'Travel', icon: '✈️' },
    { id: 2, name: 'Music', icon: '🎵' },
    { id: 3, name: 'Movie', icon: '🎬' },
    { id: 4, name: 'Holidays', icon: '🎉' },
    { id: 5, name: 'Current Events', icon: '📰' },
    { id: 6, name: 'Family', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Circle
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 每日签到 */}
        <DailyCheckIn />

        {/* 热门话题 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Hot Topics
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {hotTopics.map((topic) => (
              <button
                key={topic.id}
                className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              >
                {topic.icon} {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* 创建帖子 */}
        <CreatePost onPostCreated={loadPosts} />

        {/* 帖子列表 */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl">
              <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                还没有任何帖子
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                成为第一个分享学习动态的人吧！
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* 用户信息 */}
                <div className="flex items-center gap-3 mb-4">
                  {post.user.image ? (
                    <Image
                      src={post.user.image}
                      alt={post.user.name}
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-amber-400"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold">
                      {post.user.name[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {post.user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {getTimeAgo(post.createdAt)}
                    </p>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>

                {/* 内容 */}
                <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* 媒体 */}
                {post.mediaUrl && (
                  <div className="mb-4 rounded-2xl overflow-hidden">
                    {post.mediaType === 'image' ? (
                      <img
                        src={post.mediaUrl}
                        alt="Post media"
                        className="w-full h-auto object-cover"
                      />
                    ) : post.mediaType === 'video' ? (
                      <video
                        src={post.mediaUrl}
                        controls
                        className="w-full h-auto"
                      />
                    ) : null}
                  </div>
                )}

                {/* 互动按钮 */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">8</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">1</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
