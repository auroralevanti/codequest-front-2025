'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types/comment';
import { Comment as CommentComponent } from './Comment_Old';
import { CommentForm } from './CommentForm';
import { Separator } from '@radix-ui/react-separator';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';

interface CommentsSectionProps {
  postId: string;
  currentUser: string;
}

// Mock data for demonstration - in a real app, this would come from an API
const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    username: 'Aurora',
    content: '¡Excelente post! Muy útil la información compartida.',
    createdAt: '2025-01-19T10:30:00Z',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: '2',
        postId: '1',
        username: 'Josa',
        content: 'Totalmente de acuerdo, gracias por compartir!',
        createdAt: '2025-01-19T11:15:00Z',
        likes: 2,
        isLiked: true,
        replies: [],
        parentId: '1'
      }
    ]
  },
  {
    id: '3',
    postId: '1',
    username: 'Rodolfo',
    content: '¿Podrías explicar más sobre el punto 3? Me gustaría entender mejor.',
    createdAt: '2025-01-19T12:00:00Z',
    likes: 1,
    isLiked: false,
    replies: []
  }
];

export const CommentsSection = ({ postId, currentUser }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const token = getUserCookie()?.token;
        const res = await fetch(`${apiUrls.posts.byId(postId)}/comments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.items || data.comments || [];
        setComments(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = (data: { content: string; author: string }) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: data.author,
      content: data.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleLike = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
            const currentLikes = comment.likes ?? 0;
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? currentLikes - 1 : currentLikes + 1
            };
        }
        return comment;
      })
    );
  };

  const handleReply = (parentId: string, content: string, author: string) => {
    const newReply: Comment = {
      id: Date.now().toString(),
      postId,
      author,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      replies: [],
      parentId
    };

    setComments(prev => 
      prev.map(comment => {
        if (comment.id === parentId) {
          const currentReplies = comment.replies ?? [];
          return {
            ...comment,
            replies: [...currentReplies, newReply]
          };
        }
        return comment;
      })
    );
  };

  if (loading) {
    return (
      <div className="mt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comentarios ({comments.length})
        </h3>
        <Separator className="border-gray-200" />
      </div>

      {/* Comment Form */}
      <CommentForm onSubmit={handleAddComment} currentUser={currentUser} />

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              onLike={handleLike}
              onReply={handleReply}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};
