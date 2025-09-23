"use client"

import React, { useEffect, useState } from 'react';
import { CategoriesBadge } from './components/categories/CategoriesBadge';
import PostCard from './components/post/PostCard';

import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';
import { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


export default function BlogPage() {
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = getUserCookie()?.token;
        
        // Add pagination parameters to the API call
        const baseUrl = apiUrls.posts.list();
        const separator = baseUrl.includes('?') ? '&' : '?';
        const paginatedUrl = `${baseUrl}${separator}page=${currentPage}&limit=${postsPerPage}`;
        
        const res = await fetch(paginatedUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        const data = await res.json();
       
        // Handle different response formats
        let list: Post[] = [];
        let totalCount = 0;
        let pageCount = 1;
        
        if (Array.isArray(data)) {
          list = data;
        } else if (data.posts && Array.isArray(data.posts)) {
          list = data.posts;
          totalCount = data.total || data.totalCount || data.posts.length;
        } else if (data.data && Array.isArray(data.data)) {
          list = data.data;
          totalCount = data.total || data.totalCount || data.data.length;
        } else if (data.results && Array.isArray(data.results)) {
          list = data.results;
          totalCount = data.total || data.totalCount || data.count || data.results.length;
        }
        
        // Calculate pagination info
        if (totalCount > 0) {
          pageCount = Math.ceil(totalCount / postsPerPage);
        }
        
        setPosts(list);
        setTotalPosts(totalCount);
        setTotalPages(pageCount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
          <>
            {posts.map((p) => (
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
            ))}
            
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="flex items-center"
              >
                <FaChevronLeft className="mr-2" />
                Anterior
              </Button>
              
              <span className="text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="flex items-center"
              >
                Siguiente
                <FaChevronRight className="ml-2" />
              </Button>
            </div>
            
            <div className="text-center text-gray-500 mt-2">
              Total de posts: {totalPosts}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay posts disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}