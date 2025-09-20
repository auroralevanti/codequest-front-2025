"use client"
import React from 'react';
import Comment from './Comment';

type User = { id: string; username: string; avatarUrl?: string };

type CommentItem = {
  id: string;
  user?: User;
  body?: string;
  createdAt?: string;
  replies?: CommentItem[];
};

type Props = {
  items?: CommentItem[];
};

export default function CommentList({ items = [] }: Props) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  if (items.length === 0) return null;

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="border-t border-light-token dark:border-border-dark">
      {items.map((c, idx) => (
        <div key={c.id} className={`${idx < items.length - 1 ? 'p-4 border-b border-light-token dark:border-border-dark' : 'p-4'}`}>
          <Comment
            user={c.user}
            body={c.body}
            createdAt={c.createdAt}
            repliesCount={c.replies?.length ?? 0}
            isRepliesVisible={!!expanded[c.id]}
            onToggleReplies={() => toggle(c.id)}
          />
          {c.replies && c.replies.length > 0 && expanded[c.id] && (
            <div className="mt-4 pl-12">
              <CommentList items={c.replies} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
