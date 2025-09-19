"use client"
import React, { useEffect, useState } from 'react';
import { CategoriesBadge } from './components/categories/CategoriesBadge';
import PostCard from './components/post/PostCard';
import CommentList from './components/comment/CommentList';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';

const mockUser = { id: 'u1', username: 'Jordyn George', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' };
const mockPost = {
  id: 'p1',
  user: mockUser,
  createdAt: 'Wednesday',
  body: 'Hola DeviHola DeviHola DeviHola DeviHola DeviHola Devi',
  images: [
    'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg',
    'https://media.licdn.com/dms/image/D4E22AQERqd-FCUZA0g/feedshare-shrink_2048_1536/0/1707582515866?e=2147483647&v=beta&t=ovFCGyNnPYduDuADvD2J5q5V5E44ZTHqZe_9OqeGpv4',
    'https://media.licdn.com/dms/image/v2/D5622AQHYxabjRY81fA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1711552820275?e=2147483647&v=beta&t=yqN7G8-2Bcu1O-LY1ipW5NQ3ipa1eKAwjmmwDDEEjJE',
    'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg',
    'https://media.licdn.com/dms/image/D4E22AQERqd-FCUZA0g/feedshare-shrink_2048_1536/0/1707582515866?e=2147483647&v=beta&t=ovFCGyNnPYduDuADvD2J5q5V5E44ZTHqZe_9OqeGpv4',
    'https://media.licdn.com/dms/image/v2/D5622AQHYxabjRY81fA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1711552820275?e=2147483647&v=beta&t=yqN7G8-2Bcu1O-LY1ipW5NQ3ipa1eKAwjmmwDDEEjJE',
    'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg',
  ],
  likes: 220000,
  comments: 19800,
};

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = getUserCookie()?.token;
        const res = await fetch(apiUrls.posts.list(), {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        // Assume API returns { posts: [...] } or an array
        const list = Array.isArray(data) ? data : data.posts || [];
        setPosts(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-md mx-auto py-8">
        <div className="mb-6">
          <CategoriesBadge />
        </div>

        {loading ? (
          <div>Loading posts...</div>
        ) : (
          posts.map((p) => (
            <PostCard key={p.id} postId={p.id} user={p.author} createdAt={p.createdAt} body={p.body || p.content} images={p.images || []} likes={p.likes || 0} comments={p.commentsCount || 0} />
          ))
        )}
      </div>
    </div>
  );
}