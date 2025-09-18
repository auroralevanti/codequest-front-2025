"use client"
import React from 'react';
import FannedImages from './FannedImages';
import { MdFavoriteBorder, MdChatBubbleOutline, MdRepeat } from 'react-icons/md';

type User = { id: string; username: string; avatarUrl?: string };

type Props = { user: User; createdAt?: string; body?: string; images?: string[]; likes?: number; comments?: number };

export default function PostCard({ user, createdAt, body, images = [], likes = 0, comments = 0 }: Props) {
  return (
    <div className="bg-background-light dark:bg-background-dark p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img alt={`${user.username} profile`} src={user.avatarUrl} className="w-12 h-12 rounded-full mr-3" />
          <div>
            <p className="font-bold text-text-light dark:text-text-dark">{user.username}</p>
            <p className="text-sm text-secondary-light dark:text-secondary-dark">{createdAt}</p>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-sm">Following</button>
      </div>

      <div className="mb-4">
        <p className="text-text-light dark:text-text-dark mb-4">{body}</p>
        <FannedImages images={images} />
      </div>

      <div className="flex justify-start space-x-8">
        <div className="flex items-center space-x-2 text-secondary-light dark:text-secondary-dark">
          <MdFavoriteBorder className="text-xl" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center space-x-2 text-secondary-light dark:text-secondary-dark">
          <MdChatBubbleOutline className="text-xl" />
          <span>{comments}</span>
        </div>
        <div className="flex items-center space-x-2 text-secondary-light dark:text-secondary-dark">
          <MdRepeat className="text-xl" />
          <span>1.5K</span>
        </div>
      </div>
    </div>
  );
}
