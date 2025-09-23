"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { MdMoreHoriz } from 'react-icons/md';

type User = { id: string; username: string; avatarUrl?: string };

type Props = {
  id?: string;
  user?: User;
  body?: string;
  createdAt?: string;
};

export default function Comment({ user, body, createdAt }: Props) {
  return (
    <div className="flex">
      <Avatar>
        <AvatarImage src={user?.avatarUrl} alt={user?.username || 'Usuario'} />
        <AvatarFallback>
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      {/* <img alt={`${user?.username} profile`} className="w-10 h-10 rounded-full mr-3" src={user?.avatarUrl || undefined} /> */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-text-light dark:text-text-dark">{user?.username}</span>
            <span className="text-secondary-light dark:text-secondary-dark text-sm ml-2">{formatDate(createdAt)}</span>
          </div>
                  <MdMoreHoriz className="text-secondary-light dark:text-secondary-dark text-sm ml-2" />
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
