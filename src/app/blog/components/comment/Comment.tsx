"use client"
import React from 'react';

type User = { id: string; username: string; avatarUrl?: string };

type Props = {
  id?: string;
  user?: User;
  body?: string;
  createdAt?: string;
};

export default function Comment({ user, body, createdAt }: Props) {
  return (
    <div className="flex py-3 bg-background-light dark:bg-background-dark">
      <img src={user?.avatarUrl} alt={user?.username} className="w-10 h-10 rounded-full mr-3 object-cover border-background-light dark:border-background-dark" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-text-light dark:text-text-dark">{user?.username}</span>
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-sm ml-2">{createdAt}</span>
          </div>
        </div>
        <p className="text-text-light dark:text-text-dark mt-1">{body}</p>
      </div>
    </div>
  );
}
