export interface AdminPost {
  id: string;
  title?: string;
  content?: string;
  author?:
    { username?: string };
  status?: string;
  createdAt?: string;
}