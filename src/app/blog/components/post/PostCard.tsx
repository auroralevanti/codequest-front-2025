"use client"
import React from 'react';
import FannedImages from './FannedImages';

type User = { id: string; username: string; avatarUrl?: string };

type Props = {
  id?: string;
  user: User;
  createdAt?: string;
  body?: string;
  images?: string[];
  likes?: number;
  comments?: number;
};

export default function PostCard({ user, createdAt, body, images = [], likes = 0, comments = 0 }: Props) {
  return (
    <article className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-sm">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full mr-3 object-cover" />
          <div>
            <p className="font-bold text-text-light dark:text-text-dark">{user.username}</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{createdAt}</p>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-sm">Following</button>
      </header>

      <div className="mb-4">
        <p className="text-text-light dark:text-text-dark mb-4">{body}</p>
        <FannedImages images={images} />
      </div>

      <footer className="flex justify-start space-x-8 text-text-secondary-light dark:text-text-secondary-dark">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-xl">favorite_border</span>
          <span>{likes}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="material-icons text-xl">chat_bubble_outline</span>
          <span>{comments}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="material-icons text-xl">repeat</span>
          <span>Share</span>
        </div>
      </footer>
    </article>
  );
}
