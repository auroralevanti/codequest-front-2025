"use client"
import React, { useState } from 'react';
import FannedImages from './FannedImages';
import CommentList from '../comment/CommentList';
import { MdFavoriteBorder, MdChatBubbleOutline, MdRepeat } from 'react-icons/md';

type User = { id: string; username: string; avatarUrl?: string };

type Props = { user: User; createdAt?: string; body?: string; images?: string[]; likes?: number; comments?: number };

function AnimatedIcon({ Icon, active, activeColor, pulse, onClick }: { Icon: any; active?: boolean; activeColor?: string; pulse?: boolean; onClick?: () => void }) {
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

export default function PostCard({ user, createdAt, body, images = [], likes = 0, comments = 0 }: Props) {
  const [showComments, setShowComments] = useState(false);
  return (
    <div className="bg-background-light dark:bg-background-dark p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <img alt={`${user.username} profile`} src={user.avatarUrl} className="w-12 h-12 rounded-full mr-3" />
          <div>
            <p className="font-bold text-text-light dark:text-text-dark">{user.username}</p>
            <p className="text-sm text-secondary-light dark:text-secondary-dark">{createdAt}</p>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-sm">Following</button>
      </div>

      <div className="mb-4">
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

      {/* Collapsible comments area */}
      <div className="mt-4">
        <div
          className="overflow-hidden transition-[max-height,opacity] duration-300"
          style={{ maxHeight: showComments ? 400 : 0, opacity: showComments ? 1 : 0 }}
        >
          {showComments && (
            <CommentList
              items={[
                { id: 'c1', user: { id: 'u1', username: 'Devi', avatarUrl: '' }, body: 'Nice post!', createdAt: '2h' },
                { id: 'c2', user: { id: 'u2', username: 'Alex', avatarUrl: '' }, body: 'Great photos.', createdAt: '1h' },
              ]}
            />
          )}
        </div>
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
