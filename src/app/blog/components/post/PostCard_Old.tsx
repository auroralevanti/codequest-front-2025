'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import Link from "next/link";
import { CommentsSection } from "../comment/CommentsSection";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const posts = [
  {
    id: 1,
    author: 'Aurora',
    authorId: '1', // Add authorId for role checking
    date: '19/09/2025',
    title: 'Titulo de Prueba',
    text: ' Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, '
  },
  {
    id: 2,
    author: 'Rodolfo',
    authorId: '2',
    date: '19/09/2025',
    title: 'Titulo de Prueba',
    text: ' Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, '
  },
  {
    id: 3,
    author: 'Josa',
    authorId: '3',
    date: '19/09/2025',
    title: 'Titulo de Prueba',
    text: ' Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, Texto prueba de siempre, '
  },
]


export const PostCard = () => {
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const { user, canEditPost, canDeletePost } = useAuth();

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleEditPost = (postId: number) => {
    console.log('Edit post:', postId);
    // Implement edit functionality
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      console.log('Delete post:', postId);
      // Implement delete functionality
    }
  };

  return (
    <div>
      {
        posts.map((post) => (
          <div key={post.id} className="mb-6">
            <Card className="flex bg-white border-white p-4">
              <CardHeader className="flex justify-between">
                <h4>{post.author}</h4>
                <h4>{post.date}</h4>
              </CardHeader>
              <Separator className="border-background border-1" />
              <CardTitle>
                {post.title}
              </CardTitle>
              <CardContent>
                {post.text}
              </CardContent>
              <Separator className=" border-gray-200 border-1" />
            <CardFooter>
              <div className="flex items-center space-x-4">
                {/* Like Button */}
                <div className="flex items-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <AiOutlineHeart size={16} />
                </div>
                
                {/* Comments Button */}
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <FaComment size={16} />
                  <span className="text-sm">Comentarios</span>
                </button>

                {/* Edit Button - Only for post author or admin */}
                {canEditPost(post.authorId) && (
                  <button
                    onClick={() => handleEditPost(post.id)}
                    className="flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    title="Editar post"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}

                {/* Delete Button - Only for post author or admin */}
                {canDeletePost(post.authorId) && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
                    title="Eliminar post"
                  >
                    <AiOutlineDelete size={16} />
                  </button>
                )}
              </div>
            </CardFooter>
            </Card>
            
            {/* Comments Section */}
            {showComments[post.id] && (
              <div className="mt-4 ml-4">
                <CommentsSection 
                  postId={post.id.toString()} 
                  currentUser={user?.name || 'Usuario'} 
                />
              </div>
            )}
          </div>
        ))
      }
    </div>
  )
}
