export type Comment = {
  id: string;
  postId?: string;
  parentId?: string;
  username?: string;
  author?: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  likes?: number;
  replies?: Comment[];
};
