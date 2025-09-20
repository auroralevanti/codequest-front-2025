"use client"
import React, { useState } from 'react';
import FannedImages from './FannedImages';
import CommentList from '../comment/CommentList';
import { CommentsSection } from '../comment/CommentsSection';
import { getUserCookie } from '@/lib/cookies';
import { motion, AnimatePresence } from 'framer-motion';
import { MdFavoriteBorder, MdChatBubbleOutline, MdRepeat } from 'react-icons/md';

type User = { id: string; username: string; avatarUrl?: string };

type Props = { postId?: string; user: User; title?: string; createdAt?: string; body?: string; images?: string[]; likes?: number; comments?: number };

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function AnimatedIcon({ Icon, active, activeColor, pulse, onClick }: { Icon: IconComponent; active?: boolean; activeColor?: string; pulse?: boolean; onClick?: () => void }) {
  // pulse: temporary scale when clicked (controlled by parent)
  const scaleClass = pulse ? 'scale-110' : 'hover:scale-105';
  const colorClass = active ? activeColor ?? 'text-primary' : 'text-current';
  return (
    <span
      onClick={() => onClick && onClick()}
      className={`inline-flex items-center justify-center transition-transform duration-200 ${scaleClass} ${colorClass}`}
    >
      <Icon className="text-xl" />
    </span>
  );
}

export default function PostCard({ postId, user, title, createdAt, body, images = [], likes = 0, comments = 0 }: Props) {
    
  const [showComments, setShowComments] = useState(false);
  const commentsRef = React.useRef<HTMLDivElement | null>(null);
  const currentUser = getUserCookie()?.username || getUserCookie()?.name || 'Usuario';
  return (
    <div className="bg-background-light dark:bg-background-dark p-4 border-b border-light-token dark:border-dark-token last:border-b-0">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img alt={`${user.username} profile`} src={user.avatarUrl || undefined} className="w-12 h-12 rounded-full mr-3" />
          <div>
            <p className="font-bold text-text-light dark:text-text-dark">{user.username}</p>
            <p className="text-sm text-secondary-light dark:text-secondary-dark">{createdAt}</p>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-sm">Following</button>
      </div>

      <div className="mb-4">
        {/** Post title */}
        {Boolean(title) && (
          <h3 title={String(title)} className="font-semibold text-lg text-text-light dark:text-text-dark mb-2 truncate">
            {title}
          </h3>
        )}
        <p className="text-text-light dark:text-text-dark mb-4">{body}</p>
        <FannedImages images={images} />
      </div>

      <div className="flex justify-start space-x-8">
        <IconButtons
          likes={likes}
          commentsCount={comments}
          onLike={() => {}}
          onToggleComments={() => setShowComments(s => !s)}
        />
      </div>

      {/* Collapsible comments area (framer-motion) */}
      <div className="mt-4">
        <AnimatePresence initial={false}>
          {showComments && (
            <motion.div
              key="comments"
              initial={{ opacity: 0, height: 0, translateY: -8 }}
              animate={{ opacity: 1, height: 'auto', translateY: 0 }}
              exit={{ opacity: 0, height: 0, translateY: -8 }}
              transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1] }}
              className="overflow-auto"
            >
              <div ref={commentsRef}>
                {postId ? (
                  <CommentsSection postId={postId} currentUser={currentUser} />
                ) : (
                  <CommentList items={[]} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function IconButtons({ likes, commentsCount, onLike, onToggleComments }: { likes: number; commentsCount: number; onLike?: () => void; onToggleComments?: () => void }) {
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [shared, setShared] = useState(false);

  const [likePulse, setLikePulse] = useState(false);
  const [commentPulse, setCommentPulse] = useState(false);
  const [sharePulse, setSharePulse] = useState(false);

  const handleLike = () => {
    setLiked(prev => !prev);
    setLikePulse(true);
    setTimeout(() => setLikePulse(false), 220);
    onLike && onLike();
  };
  const handleComment = () => {
    setCommented(prev => !prev);
    setCommentPulse(true);
    setTimeout(() => setCommentPulse(false), 220);
    onToggleComments && onToggleComments();
  };
  const handleShare = () => {
    setShared(prev => !prev);
    setSharePulse(true);
    setTimeout(() => setSharePulse(false), 220);
  };

  return (
    <>
      <div className="flex items-center space-x-2 text-secondary-light dark:text-secondary-dark">
        <button aria-label="like" onClick={handleLike} className="focus:outline-none">
          <AnimatedIcon Icon={MdFavoriteBorder} active={liked} activeColor="text-red-500" pulse={likePulse} />
        </button>
        <span>{likes}</span>
      </div>
      <div className="flex items-center space-x-2 text-secondary-light dark:text-secondary-dark">
        <button aria-label="comment" onClick={handleComment} className="focus:outline-none">
          <AnimatedIcon Icon={MdChatBubbleOutline} active={commented} activeColor="text-gray-500" pulse={commentPulse} />
        </button>
        <span>{commentsCount}</span>
      </div>
      <div className="flex items-center space-x-2 text-secondary-light dark:text-secondary-dark">
        <button aria-label="share" onClick={handleShare} className="focus:outline-none">
          <AnimatedIcon Icon={MdRepeat} active={shared} activeColor="text-blue-500" pulse={sharePulse} />
        </button>
        <span>1.5K</span>
      </div>
    </>
  );
}
