'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserCookie } from '@/lib/cookies';
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
  image?: string;
}

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      const userData = getUserCookie();
      const token = userData?.token;

      try {
        // Fetch posts by category
        const postsResponse = await fetch(
          `https://codequest-backend-2025.onrender.com/api/v1/posts?category=${slug}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (!postsResponse.ok) {
          throw new Error(`HTTP error! status: ${postsResponse.status}`);
        }

        const postsData = await postsResponse.json();
        console.log('Posts data:', postsData);

        // Handle nested response structure for posts
        let postsArray = [];
        if (Array.isArray(postsData)) {
          postsArray = postsData;
        } else if (postsData.data && Array.isArray(postsData.data)) {
          postsArray = postsData.data;
        }

        setPosts(postsArray);

        // If we have posts, get category info from the first post
        if (postsArray.length > 0 && postsArray[0].category) {
          setCategory(postsArray[0].category);
        } else {
          // Fallback: fetch category details separately
          try {
            const categoryResponse = await fetch(
              `https://codequest-backend-2025.onrender.com/api/v1/categories/${slug}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              }
            );

            if (categoryResponse.ok) {
              const categoryData = await categoryResponse.json();
              const categoryInfo = categoryData.data || categoryData;
              setCategory(categoryInfo);
            }
          } catch (categoryError) {
            console.log('Could not fetch category details:', categoryError);
          }
        }

      } catch (err) {
        console.error('Error fetching category posts:', err);
        setError('Error al cargar los posts de la categoría');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndPosts();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-500">Cargando posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">
            {category?.name || slug}
          </h1>
          <Badge variant="secondary">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </Badge>
        </div>
        
        {category?.description && (
          <p className="text-gray-600 text-lg">{category.description}</p>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No se encontraron posts en esta categoría
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {post.image && (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {post.category.name}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  <a
                    href={`/blog/post/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </a>
                </h2>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt || post.content?.substring(0, 150) + '...'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {post.author.avatar && (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-500">
                      {post.author.name}
                    </span>
                  </div>
                  
                  <a
                    href={`/blog/post/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Leer más →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}