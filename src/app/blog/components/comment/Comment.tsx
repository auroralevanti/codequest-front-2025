"use client"
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
      <img alt={`${user?.username} profile`} className="w-10 h-10 rounded-full mr-3" src={user?.avatarUrl} />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-text-light dark:text-text-dark">{user?.username}</span>
            <span className="text-secondary-light dark:text-secondary-dark text-sm ml-2">{createdAt}</span>
          </div>
                  <MdMoreHoriz className="text-secondary-light dark:text-secondary-dark text-sm ml-2" />
        </div>
        <p className=" dark:text-secondary-dark text-lg">Hello Devi, Hello Devi,Hello DeviHello DeviHello DeviHello DeviHello DeviHello DeviHello DeviHello DeviHello Devi</p>
      </div>
    </div>
  );
}
