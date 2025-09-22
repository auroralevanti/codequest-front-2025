export interface Post  {
  id: string;
  author?: { id?: string; username?: string; avatarUrl?: string };
  createdAt?: string;
  body?: string;
  content?: string;
  images?: string[];
  likes?: number;
  commentsCount?: number;
};