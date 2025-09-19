export type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  likes?: number;
  replies?: Comment[];
};
