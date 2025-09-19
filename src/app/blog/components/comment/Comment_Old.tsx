'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaReply } from 'react-icons/fa';
import { Comment as CommentType } from '@/types/comment';
import { Reply } from './Reply';


interface CommentProps {
  comment: CommentType;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string, author: string) => void;
  currentUser: string;
}

export const Comment = ({ comment, onLike, onReply, currentUser }: CommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleReply = (content: string, author: string) => {
    onReply(comment.id, content, author);
    setShowReplyForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      <Card className="bg-white border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{comment.author}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-800 mb-3">{comment.content}</p>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500 p-1 h-auto"
            >
              {comment.isLiked ? (
                <AiFillHeart className="text-red-500" size={16} />
              ) : (
                <AiOutlineHeart size={16} />
              )}
              <span className="text-sm">{comment.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-700 p-1 h-auto"
            >
              <FaReply size={14} />
              <span className="text-sm">Responder</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-6">
          <Reply
            parentId={comment.id}
            onReply={handleReply}
            currentUser={currentUser}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 space-y-3">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};
