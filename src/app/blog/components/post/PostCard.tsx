"use client"

import { useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { MdFavorite, MdFavoriteBorder, MdChatBubbleOutline, MdRepeat, MdEdit } from 'react-icons/md';

import FannedImages from './FannedImages';
import CommentList from '../comment/CommentList';
import { CommentsSection } from '../comment/CommentsSection';
import CreatePost from './CreatePost';
import { getUserCookie } from '@/lib/cookies';
import { AvatarComponent } from '../avatar/Avatar';
import { Button } from '@/components/ui/button';
import { useLike } from '@/hooks/useLike';

type User = { id: string; username: string; avatarUrl?: string };

type Props = { 
  postId?: string; 
  user: User; 
  createdAt?: string; 
  body?: string; 
  title?: string;
  images?: string[]; 
  likes?: number; 
  comments?: number;
  categoryId?: string;
  tagIds?: string[];
};

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

function AnimatedIcon({ Icon, active, activeColor, pulse, onClick }: { Icon: IconComponent; active?: boolean; activeColor?: string; pulse?: boolean; onClick?: () => void }) {
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

export default function PostCard({ postId, user, createdAt, body, title, images = [], likes = 0, comments = 0, categoryId, tagIds }: Props) {
    
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  const currentUser = getUserCookie();
  const currentUsername = currentUser?.username || currentUser?.name || 'Usuario';

  const isOwner = currentUser?.id === user.id || currentUser?.username === user.username;

 
  const postData = {
    postId,
    title: title || '',
    content: body || '',
    images: images || [],
    categoryId,
    tagIds: tagIds || []
  };

  const { liked, likeCount, loading, toggleLike } = useLike({ 
    postId, 
    initialLikeCount: likes || 0 
  });

  return (
    <>
      <div className="bg-white p-4 border-10 border-accent-background mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className='mr-2'>
              <AvatarComponent />
            </div>
            <div>
              <p className="font-bold text-black mb-1">{user.username}</p>
              <p className="text-sm text-black">{createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            
            {
            isOwner && (
              <Button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
                title="Editar post"
              >
                <MdEdit size={20} />
              </Button>
            )}

            <button className="bg-primary text-black px-4 py-1.5 rounded-full font-semibold text-sm">Following</button>
          </div>
        </div>

        <div className="mb-4">
          {title && <h3 className="font-bold text-lg text-black mb-2">{title}</h3>}
          <p className="text-black mb-4">{body}</p>
          <FannedImages images={images} />
        </div>

        <div className="flex justify-start space-x-8">
          <IconButtons
            liked={liked}
            likeCount={likeCount}
            loading={loading}
            onToggleLike={toggleLike}
            commentsCount={comments}
            onToggleComments={() => setShowComments(s => !s)}
          />
        </div>

        {/* Collapsible comments area */}
        <div className="mt-4">
          <AnimatePresence initial={false}>
            {showComments && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, height: 0, translateY: -8 }}
                animate={{ opacity: 1, height: 'auto', translateY: 0 }}
                exit={{ opacity: 0, height: 0, translateY: -8 }}
                transition={{ duration: 0.28, ease: [0.2, 0.9, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div ref={commentsRef}>
                  {postId ? (
                    <CommentsSection postId={postId} currentUser={currentUsername} />
                  ) : (
                    <CommentList items={[]} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            onClick={() => setShowEditModal(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-xl"
          />
          <div
            className="relative w-full max-w-md md:max-w-2xl lg:max-w-4xl px-4 pb-6 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CreatePost 
              onClose={() => setShowEditModal(false)}
              editData={postData}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </>
  );
}


function IconButtons({ liked, likeCount, loading,  onToggleLike, commentsCount, onToggleComments }: { 
  liked: boolean;
  likeCount: number;
  loading: boolean;
  onToggleLike: () => Promise<{ success: boolean; error?: string }>;
  commentsCount: number; 
  onToggleComments?: () => void 
}) {
  const [commented, setCommented] = useState(false);
  const [shared, setShared] = useState(false);

  const [likePulse, setLikePulse] = useState(false);
  const [commentPulse, setCommentPulse] = useState(false);
  const [sharePulse, setSharePulse] = useState(false);
  
  const currentUser = getUserCookie();

  const handleLike = async () => {
    // If user is not authenticated, we can't proceed
    if (!currentUser?.token) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    if (loading) return;

    setLikePulse(true);
    
    const result = await onToggleLike();
    if (!result.success && result.error) {
      alert(result.error);
    }
    
    setTimeout(() => setLikePulse(false), 220);
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
      <div className="flex items-center space-x-2 text-secondary-light">
        <button 
          aria-label={liked ? "unlike" : "like"} 
          onClick={handleLike} 
          className="focus:outline-none"
          disabled={loading}
        >
          <AnimatedIcon 
            Icon={liked ? MdFavorite : MdFavoriteBorder} 
            active={liked} 
            activeColor="text-red-500" 
            pulse={likePulse} 
          />
        </button>
        <span>{likeCount}</span>
      </div>
      <div className="flex items-center space-x-2 text-secondary-light">
        <button 
          aria-label="comment" 
          onClick={handleComment} 
          className="focus:outline-none"
        >
          <AnimatedIcon 
            Icon={MdChatBubbleOutline} 
            active={commented} 
            activeColor="text-background" 
            pulse={commentPulse} 
          />
        </button>
        <span>{commentsCount}</span>
      </div>
      <div className="flex items-center space-x-2 text-secondary-light">
        <button 
          aria-label="share" 
          onClick={handleShare} 
          className="focus:outline-none"
        >
          <AnimatedIcon 
            Icon={MdRepeat} 
            active={shared} 
            activeColor="text-blue-500" 
            pulse={sharePulse} 
          />
        </button>
        <span>1.5K</span>
      </div>
    </>
  );
}