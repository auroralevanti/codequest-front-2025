"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CategoriesBadge } from '../../components/categories/CategoriesBadge';
import PostCard from '../../components/post/PostCard';
import { Badge } from "@/components/ui/badge";

import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';
import { Post } from '@/types/post';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {

      const userData = getUserCookie();
      const token = userData?.token;

      const getPostsBySlug = `https://codequest-backend-2025.onrender.com/api/v1/categories/${slug}`;

      try {       
        
        const postsRes = await fetch(getPostsBySlug, {
          headers:{
            Authorization: `Bearer ${token}`
          },
        });
        
        const postsData = await postsRes.json();
        console.log('Category posts data:', postsData);
        
        // Handle nested response structure
        const postsList = Array.isArray(postsData) ? postsData : postsData.posts || postsData.data || [];
        setPosts(postsList);

        // Try to get category info from first post or fetch separately
        if (postsList.length > 0 && postsList[0].category) {
          setCategory(postsList[0].category);
        } else {
          // Fallback: fetch category details
          try {
            const categoryRes = await fetch(getPostsBySlug, {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            
            if (categoryRes.ok) {
              const categoryData = await categoryRes.json();
              const categoryInfo = categoryData.data || categoryData;
              setCategory(categoryInfo);
            }
          } catch (categoryError) {
            console.log('Could not fetch category details:', categoryError);
            // Set a basic category object with the slug
            setCategory({ id: slug, name: slug.charAt(0).toUpperCase() + slug.slice(1), slug });
          }
        }

      } catch (err) {
        console.error('Error fetching category posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndPosts();
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-background justify-center items-center">
      <div className="mx-auto py-8 justify-center items-center">
        <div className="mb-6 flex flex-wrap justify-center items-center">
          <CategoriesBadge />
        </div>

        {category && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              Posts de la categoría: {category.name}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </Badge>
            {category.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center text-white">Cargando posts...</div>
        ) : posts.length > 0 ? (
          posts.map((p) => (
            <PostCard
              key={p.id}
              postId={p.id}
              user={
                p.author
                  ? { 
                      id: String(p.author.id ?? ''), 
                      username: String(p.author.username ?? 'Unknown'), 
                      avatarUrl: p.author.avatarUrl as string | undefined 
                    }
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
            <div className="text-white text-lg">
              No se encontraron posts en esta categoría
            </div>
            <p className="text-sm text-white mt-2">
              Prueba seleccionando otra categoría
            </p>
          </div>
        )}
      </div>
    </div>
  );
}