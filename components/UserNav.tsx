'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';

export default function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 animate-pulse" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <a
        href="/api/auth/signin"
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
      >
        <User className="w-4 h-4" />
        <span>Sign In</span>
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* User information card */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-md border border-amber-200 dark:border-gray-700">
        {/* Avatar */}
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User'}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-amber-400"
          />
        )}
        
        {/* User information */}
        <div className="hidden sm:block">
          <p className="font-semibold text-sm text-gray-800 dark:text-white">
            {session.user.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {session.user.email}
          </p>
        </div>
      </div>

      {/* Sign-out button */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}
