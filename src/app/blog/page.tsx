"use client"
import React from 'react';
import { CategoriesBadge } from './components/categories/CategoriesBadge';
import PostCard from './components/post/PostCard';
import CommentList from './components/comment/CommentList';

const mockUser = { id: 'u1', username: 'Jordyn George', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' };
const mockPost = {
  id: 'p1',
  user: mockUser,
  createdAt: 'Wednesday',
  body: 'Hola DeviHola DeviHola DeviHola DeviHola DeviHola Devi',
  images: [
    'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg',
    'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg',
    'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg',
  ],
  likes: 220000,
  comments: 19800,
};

const mockComments = [
  { id: 'c1', user: { id: 'u2', username: 'James Dias', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' }, body: 'Hola Devi', createdAt: '12h ago' },
  { id: 'c2', user: { id: 'u3', username: 'Tiana Bergson', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' }, body: 'Nice post!', createdAt: '19h ago' },
  { id: 'c3', user: { id: 'u4', username: 'Kadin Bator', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' }, body: 'Great pictures', createdAt: 'Yesterday' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-md mx-auto py-8">
        <div className="mb-6">
          <CategoriesBadge />
        </div>

        <PostCard user={mockPost.user} createdAt={mockPost.createdAt} body={mockPost.body} images={mockPost.images} likes={mockPost.likes} comments={mockPost.comments} />

        <div className="mt-6">
          <CommentList items={mockComments} />
        </div>
      </div>
    </div>
  );
}