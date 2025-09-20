"use client"
import React from 'react';
import { MdMoreHoriz, MdChatBubbleOutline } from 'react-icons/md';

type User = { id: string; username: string; avatarUrl?: string };

type Props = {
  id?: string;
  user?: User;
  body?: string;
  createdAt?: string;
  repliesCount?: number;
  isRepliesVisible?: boolean;
  onToggleReplies?: () => void;
};

export default function Comment({ user, body, createdAt, repliesCount = 0, isRepliesVisible = false, onToggleReplies }: Props) {
  return (
    <div className="flex">
      <img alt={`${user?.username} profile`} className="w-10 h-10 rounded-full mr-3" src={user?.avatarUrl || undefined} />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-text-light dark:text-text-dark">{user?.username}</span>
            <span className="text-secondary-light dark:text-secondary-dark text-sm ml-2">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            {repliesCount > 0 && (
              <button aria-label="toggle-replies" onClick={onToggleReplies} className="flex items-center text-secondary-light dark:text-secondary-dark text-sm focus:outline-none">
                <MdChatBubbleOutline className={`${isRepliesVisible ? 'text-gray-600' : ''} mr-1`} />
                <span className="text-xs">{repliesCount}</span>
              </button>
            )}
            <MdMoreHoriz className="text-secondary-light dark:text-secondary-dark text-sm ml-2" />
          </div>
        </div>
        <p className=" dark:text-secondary-dark text-lg">{body}</p>
      </div>
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateString;
  }
}
