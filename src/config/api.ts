// API Configuration
const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://codequest-backend-2025.onrender.com',
    version: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  },
  endpoints: {
    auth: 'auth',
    users: 'users',
    posts: 'posts',
    comments: 'comments',
    likes: 'likes',
    categories: 'categories',
    tags: 'tags',
  }
} as const;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: keyof typeof config.endpoints, path?: string): string => {
  const baseEndpoint = `${config.api.baseUrl}/api/${config.api.version}/${config.endpoints[endpoint]}`;
  return path ? `${baseEndpoint}${path.startsWith('/') ? path : `/${path}`}` : baseEndpoint;
};

// Specific API URL builders
export const apiUrls = {
  // Auth endpoints
  auth: {
    login: () => buildApiUrl('auth', '/login'),
    signup: () => buildApiUrl('auth', '/signup'),
    discord: () => buildApiUrl('auth', '/discord'),
    profile: () => buildApiUrl('auth', '/profile'),
  },
  
  // Users endpoints
  users: {
    me: () => buildApiUrl('users', '/me'),
    list: (limit?: number, offset?: number) => {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      const query = params.toString();
      return buildApiUrl('users') + (query ? `?${query}` : '');
    },
    byId: (userId: string) => buildApiUrl('users', `/${userId}`),
  },
  
  // Posts endpoints
  posts: {
    list: () => buildApiUrl('posts'),
    create: () => buildApiUrl('posts'),
    byId: (postId: string) => buildApiUrl('posts', `/${postId}`),
  },
  
  // Comments endpoints
  comments: {
    list: () => buildApiUrl('comments'),
    create: () => buildApiUrl('comments'),
    byId: (commentId: string) => buildApiUrl('comments', `/${commentId}`),
    byPost: (postId: string) => buildApiUrl('comments', `/post/${postId}`),
  },
  
  // Likes endpoints
  likes: {
    list: () => buildApiUrl('likes'),
    create: () => buildApiUrl('likes'),
    byId: (likeId: string) => buildApiUrl('likes', `/${likeId}`),
  },
  
  // Categories endpoints
  categories: {
    list: () => buildApiUrl('categories'),
    create: () => buildApiUrl('categories'),
    byId: (categoryId: string) => buildApiUrl('categories', `/${categoryId}`),
  },
  
  // Tags endpoints
  tags: {
    list: () => buildApiUrl('tags'),
    create: () => buildApiUrl('tags'),
    byId: (tagId: string) => buildApiUrl('tags', `/${tagId}`),
  },
};

export default config;