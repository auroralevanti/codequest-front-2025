import { useState, useEffect } from 'react';
import { likePost, unlikePost, checkIfLiked } from '@/lib/likeService';
import { getUserCookie } from '@/lib/cookies';

interface UseLikeProps {
  postId?: string;
  initialLikeCount: number;
}

export const useLike = ({ postId, initialLikeCount }: UseLikeProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentUser = getUserCookie();

  // Check if user has already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUser?.token || !postId) return;
      
      try {
        const likeData = await checkIfLiked(postId);
        if (likeData) {
          setLiked(true);
          setLikeId(likeData.id);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [currentUser?.token, postId]);

  const toggleLike = async () => {
    // If user is not authenticated or postId is not provided, we can't proceed
    if (!currentUser?.token || !postId) {
      return { success: false, error: 'User not authenticated or postId missing' };
    }

    setLoading(true);
    
    const newLikedState = !liked;
    const previousLikeCount = likeCount;
    const previousLikeId = likeId;
    
    // Optimistically update UI
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

    try {
      if (newLikedState) {
        // Like the post
        const likeData = await likePost(postId);
        if (likeData) {
          setLikeId(likeData.id);
        }
      } else {
        // Unlike the post
        if (likeId) {
          await unlikePost(likeId);
          setLikeId(null);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setLiked(!newLikedState);
      setLikeCount(previousLikeCount);
      setLikeId(previousLikeId);
      
      return { success: false, error: error instanceof Error ? error.message : 'Error toggling like' };
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    likeCount,
    likeId,
    loading,
    toggleLike,
  };
};