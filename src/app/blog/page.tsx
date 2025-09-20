"use client"
import React, { useEffect, useState } from 'react';
import { CategoriesBadge } from './components/categories/CategoriesBadge';
import PostCard from './components/post/PostCard';
import CommentList from './components/comment/CommentList';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';

const mockUser = { id: 'u1', username: 'Jordyn George', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' };

export default function BlogPage() {
  type Post = {
    id: string;
    author?: { id?: string; username?: string; avatarUrl?: string };
    createdAt?: string;
    title?: string;
    body?: string;
    content?: string;
    images?: string[];
    likes?: number;
    commentsCount?: number;
  };

  const [posts, setPosts] = useState<Post[]>([]);
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
            <PostCard
              key={p.id}
              postId={p.id}
              user={
                p.author
                  ? { id: String(p.author.id ?? ''), username: String(p.author.username ?? 'Unknown'), avatarUrl: p.author.avatarUrl as string | undefined }
                  : { id: '', username: 'Unknown', avatarUrl: undefined }
              }
              createdAt={p.createdAt}
              title={p.title}
              body={p.body || p.content}
              images={p.images || []}
              likes={p.likes || 0}
              comments={p.commentsCount || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}