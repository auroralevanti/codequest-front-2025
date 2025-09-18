"use client"
import React from 'react';
import Comment from './Comment';

type User = { id: string; username: string; avatarUrl?: string };

type CommentItem = {
  id: string;
  user?: User;
  body?: string;
  createdAt?: string;
};

type Props = {
  items?: CommentItem[];
};

export default function CommentList({ items = [] }: Props) {
  if (items.length === 0) return null;
  return (
    <div className="border-t border-border-light dark:border-border-dark">
      {items.map((c) => (
        <div key={c.id} className="p-4 border-b border-border-light dark:border-border-dark">
          <Comment user={c.user} body={c.body} createdAt={c.createdAt} />
        </div>
      ))}
    </div>
  );
}
