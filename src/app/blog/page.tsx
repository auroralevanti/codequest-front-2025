import { CategoriesBadge } from "./components/categories/CategoriesBadge";
import { PostCard } from "./components/post/PostCard_Old";

export default function BlogPage() {
  return (
    <div>
      <div>
        <CategoriesBadge />
      </div>
      <PostCard />
    </div>
  );
}