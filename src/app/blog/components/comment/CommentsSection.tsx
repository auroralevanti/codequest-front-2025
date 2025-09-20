'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3; // page size

  useEffect(() => {
    const fetchComments = async (pageOffset = 0) => {
      try {
        setLoading(true);
        const token = getUserCookie()?.token;
        const url = `${apiUrls.posts.byId(postId)}/comments?limit=${limit}&offset=${pageOffset}`;
        console.debug('[CommentsSection] fetching', url);
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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

        // For each parent comment, fetch its replies and attach
        const withReplies = await Promise.all(
          normalized.map(async (parent) => {
            try {
              const repliesRes = await fetch(`${apiUrls.comments.byId(parent.id)}/replies?limit=50` , {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              });
              if (!repliesRes.ok) return { ...parent, replies: [] };
              const repliesData = await repliesRes.json();
              let rlist: Array<Record<string, unknown>> = [];
              if (Array.isArray(repliesData)) rlist = repliesData as Array<Record<string, unknown>>;
              else if (repliesData && typeof repliesData === 'object' && Array.isArray((repliesData as Record<string, unknown>).data)) rlist = (repliesData as Record<string, unknown>).data as Array<Record<string, unknown>>;
              else if (repliesData && typeof repliesData === 'object' && Array.isArray((repliesData as Record<string, unknown>).items)) rlist = (repliesData as Record<string, unknown>).items as Array<Record<string, unknown>>;
              else if (repliesData && typeof repliesData === 'object' && Array.isArray((repliesData as Record<string, unknown>).comments)) rlist = (repliesData as Record<string, unknown>).comments as Array<Record<string, unknown>>;
              else rlist = [];

              const normalizedReplies = rlist.map((c) => ({
                id: String(c['id'] ?? ''),
                postId: String(c['postId'] ?? c['post_id'] ?? ''),
                parentId: String(c['parentCommentId'] ?? c['parentId'] ?? c['parent_comment_id'] ?? '') || undefined,
                author: (c['author'] && ((c['author'] as any).username || (c['author'] as any).name)) || c['username'] || 'Usuario',
                avatarUrl: (c['author'] && (c['author'] as any).avatarUrl) || c['authorAvatar'] || c['avatarUrl'] || undefined,
                content: (c['content'] as string) || (c['body'] as string) || '',
                createdAt: (c['createdAt'] as string) || (c['created_at'] as string) || new Date().toISOString(),
                isLiked: Boolean(c['isLiked'] ?? c['isLikedByUser'] ?? false),
                likes: Number(c['likes'] ?? c['likesCount'] ?? 0),
                replies: [],
              }));

              return { ...parent, replies: normalizedReplies } as NormalizedComment;
            } catch (e) {
              return { ...parent, replies: [] } as NormalizedComment;
            }
          })
        );

        // If pageOffset is 0, replace; otherwise append
        setComments(prev => (pageOffset === 0 ? withReplies : [...prev, ...withReplies]));
        // If returned fewer than limit, no more pages
        if (normalized.length < limit) setHasMore(false);
      } catch (err) {
        console.error('[CommentsSection] error fetching comments', err);
        // fallback to mock data so UI remains usable
        const fallback = mockComments.filter(c => String(c.postId) === String(postId));
        setComments(prev => (pageOffset === 0 ? fallback : [...prev, ...fallback.slice(offset, offset + limit)]));
      } finally {
        setLoading(false);
      }
    };

    // initial load
    fetchComments(0);
  }, [postId]);

  // Scrollable comments container showing ~3 comments and loading more on scroll
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadNextPage = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    try {
      const token = getUserCookie()?.token;
      const res = await fetch(`${apiUrls.posts.byId(postId)}/comments?limit=${limit}&offset=${nextOffset}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }
      const data = await res.json();
      let list: Array<Record<string, unknown>> = [];
      if (Array.isArray(data)) list = data as Array<Record<string, unknown>>;
      else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).data)) list = (data as Record<string, unknown>).data as Array<Record<string, unknown>>;
      else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).items)) list = (data as Record<string, unknown>).items as Array<Record<string, unknown>>;
      else if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).comments)) list = (data as Record<string, unknown>).comments as Array<Record<string, unknown>>;
      else list = [];

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
          replies: [],
        } as NormalizedComment;
      });

      // fetch replies for these parents
      const withReplies = await Promise.all(
        normalized.map(async (parent) => {
          try {
            const repliesRes = await fetch(`${apiUrls.comments.byId(parent.id)}/replies?limit=50`, {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (!repliesRes.ok) return { ...parent, replies: [] } as NormalizedComment;
            const repliesData = await repliesRes.json();
            let rlist: Array<Record<string, unknown>> = [];
            if (Array.isArray(repliesData)) rlist = repliesData as Array<Record<string, unknown>>;
            else if (repliesData && typeof repliesData === 'object' && Array.isArray((repliesData as Record<string, unknown>).data)) rlist = (repliesData as Record<string, unknown>).data as Array<Record<string, unknown>>;
            else if (repliesData && typeof repliesData === 'object' && Array.isArray((repliesData as Record<string, unknown>).items)) rlist = (repliesData as Record<string, unknown>).items as Array<Record<string, unknown>>;
            else if (repliesData && typeof repliesData === 'object' && Array.isArray((repliesData as Record<string, unknown>).comments)) rlist = (repliesData as Record<string, unknown>).comments as Array<Record<string, unknown>>;
            else rlist = [];

            const normalizedReplies = rlist.map((c) => ({
              id: String(c['id'] ?? ''),
              postId: String(c['postId'] ?? c['post_id'] ?? ''),
              parentId: String(c['parentCommentId'] ?? c['parentId'] ?? c['parent_comment_id'] ?? '') || undefined,
              author: (c['author'] && ((c['author'] as any).username || (c['author'] as any).name)) || c['username'] || 'Usuario',
              avatarUrl: (c['author'] && (c['author'] as any).avatarUrl) || c['authorAvatar'] || c['avatarUrl'] || undefined,
              content: (c['content'] as string) || (c['body'] as string) || '',
              createdAt: (c['createdAt'] as string) || (c['created_at'] as string) || new Date().toISOString(),
              isLiked: Boolean(c['isLiked'] ?? c['isLikedByUser'] ?? false),
              likes: Number(c['likes'] ?? c['likesCount'] ?? 0),
              replies: [],
            }));

            return { ...parent, replies: normalizedReplies } as NormalizedComment;
          } catch (e) {
            return { ...parent, replies: [] } as NormalizedComment;
          }
        })
      );

      setComments(prev => [...prev, ...withReplies]);
      if (normalized.length < limit) setHasMore(false);
    } catch (e) {
      console.error('[CommentsSection] loadNextPage error', e);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      loadNextPage();
    }
  };

  const handleAddComment = (data: { content: string; author: string }) => {
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

      {/* Comments List - scrollable container showing ~3 comments */}
      <div
        ref={commentsContainerRef}
        onScroll={handleScroll}
        className="space-y-4 overflow-y-auto"
        style={{ maxHeight: '24rem' }}
      >
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
              replies: c.replies?.map(r => ({
                id: r.id,
                user: { id: r.id, username: String(r.author || 'Usuario'), avatarUrl: r.avatarUrl },
                body: r.content,
                createdAt: r.createdAt,
                replies: r.replies?.map(rr => ({
                  id: rr.id,
                  user: { id: rr.id, username: String(rr.author || 'Usuario'), avatarUrl: rr.avatarUrl },
                  body: rr.content,
                  createdAt: rr.createdAt,
                }))
              }))
            }))}
          />
        )}

        {loadingMore && <div className="text-sm text-gray-500 py-2">Cargando más comentarios...</div>}
        {loading && comments.length === 0 && <div className="mt-2 text-sm text-gray-500">Cargando comentarios...</div>}
        {!hasMore && comments.length === 0 && <div className="mt-2 text-sm text-gray-500">No comments yet</div>}
      </div>
    </div>
  );
};
