
export interface UserData {
  id: string;
  username: string;
  email: string;
  roles: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  token?: string;
}


export interface PostData {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
  author?: {
    id: string;
    username: string;
    email?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tags?: TagData[];
}


export interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string | null;
  };
  postId: string;
  replies?: ReplyData[];
}


export interface ReplyData {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string | null;
  };
  commentId: string;
}


export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  postCount?: number;
}


export interface TagData {
  id: string;
  name: string;
  slug: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
  postCount?: number;
}


export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}


export interface LoginResponse {
  user: UserData;
  token: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  user: UserData;
  token: string;
  message: string;
}


export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalAdmins: number;
  recentUsers: UserData[];
  recentPosts: PostData[];
  popularPosts: PostData[];
}


export interface ApiError {
  message: string;
  statusCode: number;
  errors?: {
    field: string;
    message: string;
  }[];
}