"use client"

import React, { useEffect, useState } from 'react';
import { CategoriesBadge } from './components/categories/CategoriesBadge';
import PostCard from './components/post/PostCard';

import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';
import { Post } from '@/types/post';


export default function BlogPage() {
  

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
        
        const data = await res.json();
       
        // Handle different response formats
        let list: Post[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data.posts && Array.isArray(data.posts)) {
          list = data.posts;
        } else if (data.data && Array.isArray(data.data)) {
          list = data.data;
        }
        
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
    <div className="min-h-screen bg-background justify-center items-center">
      <div className="mx-auto py-8 justify-center items-center">
        <div className=" mb-6 flex flex-wrap justify-center items-center">
          <CategoriesBadge />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-3">Cargando posts...</span>
          </div>
        ) : posts.length > 0 ? (
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
              body={p.body || p.content}
              images={p.images || []}
              likes={p.likes || 0}
              comments={p.commentsCount || 0}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay posts disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}