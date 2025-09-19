"use client"
import React from 'react';
import { MdVerified } from 'react-icons/md';
import { getUserCookie, UserData } from '@/lib/cookies';

export default function UserBadge({ user }: { user?: Partial<UserData> }) {
  const u = (user as Partial<UserData>) ?? getUserCookie();
  const name = u?.username || u?.name || 'Usuario';
  const avatar = u?.avatar as string | undefined;

  return (
    <div className="flex items-center space-x-3">
      <img alt={`${name} profile`} src={avatar} className="w-10 h-10 rounded-full" />
      <div>
        <div className="flex items-center">
          <span className="font-semibold text-text-light dark:text-text-dark">{name}</span>
          <MdVerified className="text-blue-500 ml-1" style={{ fontSize: 16 }} />
        </div>
      </div>
    </div>
  );
}
