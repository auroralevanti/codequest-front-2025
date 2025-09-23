'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types/comment';
import CommentList from './CommentList';
import { CommentForm } from './CommentForm';
import { Separator } from '@radix-ui/react-separator';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';

interface CommentsSectionProps {
  postId: string;
  currentUser: string;
}

// Local normalized comment shape used inside this component
type NormalizedComment = {
  id: string;
  postId: string;
  parentId?: string;
  author: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
  isLiked: boolean;
  likes: number;
  replies: NormalizedComment[];
};

// Mock data for demonstration - normalized to `NormalizedComment`
const mockComments: NormalizedComment[] = [
  {
    id: '1',
    postId: '1',
    author: 'Aurora',
    content: '¡Excelente post! Muy útil la información compartida.',
    createdAt: '2025-01-19T10:30:00Z',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: '2',
        postId: '1',
        author: 'Josa',
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
    author: 'Rodolfo',
    content: '¿Podrías explicar más sobre el punto 3? Me gustaría entender mejor.',
    createdAt: '2025-01-19T12:00:00Z',
    likes: 1,
    isLiked: false,
    replies: []
  }
];

export const CommentsSection = ({ postId, currentUser }: CommentsSectionProps) => {
  const [comments, setComments] = useState<NormalizedComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const token = getUserCookie()?.token;
        const url = `${apiUrls.posts.byId(postId)}/comments`;
        console.debug('[CommentsSection] fetching', url);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.debug('[CommentsSection] response', res.status, res.statusText);
        if (!res.ok) {
          // fallback to mock for UX while debugging
          console.error('[CommentsSection] failed to fetch comments, using mockComments');
          setComments(mockComments.filter(c => String(c.postId) === String(postId)));
          return;
        }

        const data = await res.json();
        // API may return { data: [...], total } or { items: [...] } or direct array
  let list: Array<Record<string, unknown>> = [];
  if (Array.isArray(data)) list = data as Array<Record<string, unknown>>;
  else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).data)) list = (data as Record<string, unknown>).data as Array<Record<string, unknown>>;
  else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).items)) list = (data as Record<string, unknown>).items as Array<Record<string, unknown>>;
  else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).comments)) list = (data as Record<string, unknown>).comments as Array<Record<string, unknown>>;
  else list = [];

        // Normalize comments: backend returns author as object { id, username, avatarUrl }
        const normalized = list.map((c) => {
          const id = String(c['id'] ?? '');
          const postIdVal = c['postId'] ?? c['post_id'] ?? '';
          const parentId = (c['parentCommentId'] ?? c['parentId'] ?? c['parent_comment_id']) as string | undefined;
          const authorObj = c['author'] as Record<string, unknown> | undefined;
          const authorName = (authorObj && ((authorObj['username'] as string) || (authorObj['name'] as string))) || (c['username'] as string) || (c['authorName'] as string) || 'Usuario';
          const avatarUrl = (authorObj && (authorObj['avatarUrl'] as string)) || (c['authorAvatar'] as string) || (c['avatarUrl'] as string) || undefined;
          const content = (c['content'] as string) || (c['body'] as string) || '';
          const createdAt = (c['createdAt'] as string) || (c['created_at'] as string) || new Date().toISOString();
          const isLiked = (c['isLiked'] as boolean) ?? (c['isLikedByUser'] as boolean) ?? false;
          const likes = (c['likes'] as number) ?? (c['likesCount'] as number) ?? (c['likesCountTotal'] as number) ?? 0;
          const replies = Array.isArray(c['replies']) ? (c['replies'] as unknown[]).map((r) => ({
            id: String((r as Record<string, unknown>)['id'] ?? ''),
            postId: String(((r as Record<string, unknown>)['postId'] ?? (r as Record<string, unknown>)['post_id']) ?? ''),
            parentId: String((r as Record<string, unknown>)['parentId'] ?? (r as Record<string, unknown>)['parent_comment_id'] ?? '') || undefined,
            author: String((r as Record<string, unknown>)['author'] ?? (r as Record<string, unknown>)['username'] ?? 'Usuario'),
            avatarUrl: (r as Record<string, unknown>)['avatarUrl'] as string | undefined,
            content: String((r as Record<string, unknown>)['content'] ?? (r as Record<string, unknown>)['body'] ?? ''),
            createdAt: String((r as Record<string, unknown>)['createdAt'] ?? (r as Record<string, unknown>)['created_at'] ?? new Date().toISOString()),
            isLiked: Boolean((r as Record<string, unknown>)['isLiked'] ?? (r as Record<string, unknown>)['isLikedByUser'] ?? false),
            likes: Number((r as Record<string, unknown>)['likes'] ?? (r as Record<string, unknown>)['likesCount'] ?? 0),
            replies: [],
          })) : [];

          return {
            id,
            postId: String(postIdVal),
            parentId,
            author: String(authorName),
            avatarUrl,
            content,
            createdAt,
            isLiked,
            likes,
            replies,
          };
        });

        setComments(normalized);
      } catch (err) {
        console.error('[CommentsSection] error fetching comments', err);
        // fallback to mock data so UI remains usable
        setComments(mockComments.filter(c => String(c.postId) === String(postId)));
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async (data: { content: string; author: string }) => {
    try {
      const token = getUserCookie()?.token;
      if (!token) {
        console.error('[CommentsSection] No authentication token found');
        // Fallback to local state if no token
        const newComment: NormalizedComment = {
          id: Date.now().toString(),
          postId: String(postId),
          author: data.author,
          content: data.content,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          replies: []
        };
        setComments(prev => [...prev, newComment]);
        return;
      }

      // Post to API with correct format
      const response = await fetch(apiUrls.comments.create(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          body: data.content,
          postId: postId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[CommentsSection] Failed to post comment:', response.status, response.statusText, errorText);
        throw new Error(`Failed to post comment: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Normalize the response to match our internal structure
      const apiComment = responseData.data || responseData;
      const normalizedComment: NormalizedComment = {
        id: String(apiComment.id ?? Date.now().toString()),
        postId: String(apiComment.postId ?? postId),
        author: String(apiComment.author?.username ?? apiComment.username ?? apiComment.author ?? data.author),
        content: String(apiComment.body ?? apiComment.content ?? data.content),
        createdAt: String(apiComment.createdAt ?? new Date().toISOString()),
        likes: Number(apiComment.likes ?? 0),
        isLiked: Boolean(apiComment.isLiked ?? false),
        replies: Array.isArray(apiComment.replies) ? apiComment.replies : [],
        avatarUrl: apiComment.author?.avatarUrl ?? apiComment.avatarUrl
      };

      setComments(prev => [...prev, normalizedComment]);
    } catch (error) {
      console.error('[CommentsSection] Error posting comment:', error);
      // Fallback to local state on error
      const newComment: NormalizedComment = {
        id: Date.now().toString(),
        postId: String(postId),
        author: data.author,
        content: data.content,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replies: []
      };
      setComments(prev => [...prev, newComment]);
    }
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

  const handleReply = async (parentId: string, content: string, author: string) => {
    try {
      const token = getUserCookie()?.token;
      if (!token) {
        console.error('[CommentsSection] No authentication token found for reply');
        // Fallback to local state if no token
        const newReply: NormalizedComment = {
          id: Date.now().toString(),
          postId: String(postId),
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
              } as NormalizedComment;
            }
            return comment;
          })
        );
        return;
      }

      // Post reply to API with correct format
      const response = await fetch(apiUrls.comments.create(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          body: content,
          postId: postId,
          parentCommentId: parentId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[CommentsSection] Failed to post reply:', response.status, response.statusText, errorText);
        throw new Error(`Failed to post reply: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Normalize the response to match our internal structure
      const apiReply = responseData.data || responseData;
      const normalizedReply: NormalizedComment = {
        id: String(apiReply.id ?? Date.now().toString()),
        postId: String(apiReply.postId ?? postId),
        parentId: String(apiReply.parentCommentId ?? apiReply.parentId ?? parentId),
        author: String(apiReply.author?.username ?? apiReply.username ?? apiReply.author ?? author),
        content: String(apiReply.body ?? apiReply.content ?? content),
        createdAt: String(apiReply.createdAt ?? new Date().toISOString()),
        likes: Number(apiReply.likes ?? 0),
        isLiked: Boolean(apiReply.isLiked ?? false),
        replies: Array.isArray(apiReply.replies) ? apiReply.replies : [],
        avatarUrl: apiReply.author?.avatarUrl ?? apiReply.avatarUrl
      };

      setComments(prev => 
        prev.map(comment => {
          if (comment.id === parentId) {
            const currentReplies = comment.replies ?? [];
            return {
              ...comment,
              replies: [...currentReplies, normalizedReply]
            } as NormalizedComment;
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('[CommentsSection] Error posting reply:', error);
      // Fallback to local state on error
      const newReply: NormalizedComment = {
        id: Date.now().toString(),
        postId: String(postId),
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
            } as NormalizedComment;
          }
          return comment;
        })
      );
    }
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
          // Map internal comment shape to CommentList items
          <CommentList
            items={comments.map(c => ({
              id: c.id,
              user: { id: c.id, username: String(c.author || 'Usuario'), avatarUrl: c.avatarUrl },
              body: c.content,
              createdAt: c.createdAt,
            }))}
          />
        )}
      </div>
    </div>
  );
};
