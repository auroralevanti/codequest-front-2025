import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';

export interface LikeResponse {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface LikeCountResponse {
  likesCount: number;
}

/**
 * Like a post
 * @param postId - The ID of the post to like
 * @returns The like object if successful
 */
export const likePost = async (postId: string): Promise<LikeResponse | null> => {
  try {
    const user = getUserCookie();
    if (!user?.token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(apiUrls.likes.create(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        postId: postId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to like post: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

/**
 * Unlike a post
 * @param likeId - The ID of the like to remove
 * @returns true if successful
 */
export const unlikePost = async (likeId: string): Promise<boolean> => {
  try {
    const user = getUserCookie();
    if (!user?.token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(apiUrls.likes.byId(likeId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to unlike post: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
};

/**
 * Check if the current user has liked a specific post
 * @param postId - The ID of the post to check
 * @returns The like object if the user has liked the post, null otherwise
 */
export const checkIfLiked = async (postId: string): Promise<LikeResponse | null> => {
  try {
    const user = getUserCookie();
    if (!user?.token) {
      return null;
    }

    // Assuming the backend has an endpoint to check if a user has liked a post
    // This might need to be adjusted based on the actual backend API
    const response = await fetch(`${apiUrls.likes.list()}?postId=${postId}&userId=${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      // If not found, it just means the user hasn't liked the post
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      throw new Error(`Failed to check if post is liked: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    // If there's data and it's an array with at least one item, return the first like
    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      return result.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error checking if post is liked:', error);
    throw error;
  }
};

/**
 * Get the total like count for a post
 * @param postId - The ID of the post
 * @returns The number of likes for the post
 */
export const getLikeCount = async (postId: string): Promise<number> => {
  try {
    const response = await fetch(apiUrls.posts.byId(postId), {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get post like count: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result.data?.likes || 0;
  } catch (error) {
    console.error('Error getting post like count:', error);
    throw error;
  }
};