"use client"

import { useRef, useState } from 'react';
import FannedImages from './FannedImages';
import CommentList from '../comment/CommentList';
import { motion, AnimatePresence } from 'framer-motion';
import { MdFavoriteBorder, MdChatBubbleOutline, MdRepeat } from 'react-icons/md';

/*El tipado de usuario debe venir de @lib/cookies. Eliminar el establecer el tipado de aqui */
type User = { id: string; username: string; avatarUrl?: string };

/*Asi no se establecen props en nextjs, si en react. En nextjs es como el ejemplo y luego pasarlas a PostCard */
/*AnimatedIcon debe ser un componente aparte no estar aqui */
/* interface Props {
  ser: User;
  createdAt?: string;
  body?: string;
  images?: string[];
  likes?: number;
  comments?: number
} */
type Props = { user: User; createdAt?: string; body?: string; images?: string[]; likes?: number; comments?: number };

/*Icon no puede ser de tipo any. */
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

/*Usar data del endpoint borrar esta. para el avatar se usa el componente Avatar ya creado */
const mockComments = [
  { id: 'c1', user: { id: 'u2', username: 'James Dias', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' }, body: 'Hola Devi', createdAt: '12h ago' },
  { id: 'c2', user: { id: 'u3', username: 'Tiana Bergson', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' }, body: 'Nice post!', createdAt: '19h ago' },
  { id: 'c3', user: { id: 'u4', username: 'Kadin Bator', avatarUrl: 'https://i.ytimg.com/vi/PhOEqsmWpdg/maxresdefault.jpg' }, body: 'Great pictures', createdAt: 'Yesterday' },
];

/*Para los componentes es mas facil leerlo con funcion de flecha */
export default function PostCard({ user, createdAt, body, images = [], likes = 0, comments = 0 }: Props) {
    
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-white">
          <img alt={`${user.username} profile`} src={user.avatarUrl || undefined} className="w-12 h-12 rounded-full mr-3" />
          <div>
            <p className="font-bold text-white ">{user.username}</p>
            <p className="text-sm text-white">{createdAt}</p>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-1.5 rounded-full font-semibold text-sm">Following</button>
      </div>

      <div className="mb-4">
        <p className="text-white mb-4">{body}</p>
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
              className="overflow-hidden"
            >
              <div ref={commentsRef}>
                <CommentList
                  items={mockComments}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


/*Esto es otro componente, no debe estar aqui. Revisa que no importes REACT de React, eso no es necesario en nextjs */
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
      <div className="flex items-center space-x-2 text-white">
        <button aria-label="like" onClick={handleLike} className="focus:outline-none">
          <AnimatedIcon Icon={MdFavoriteBorder} active={liked} activeColor="text-red-500" pulse={likePulse} />
        </button>
        <span>{likes}</span>
      </div>
      <div className="flex items-center space-x-2 text-white">
        <button aria-label="comment" onClick={handleComment} className="focus:outline-none">
          <AnimatedIcon Icon={MdChatBubbleOutline} active={commented} activeColor="text-gray-500" pulse={commentPulse} />
        </button>
        <span>{commentsCount}</span>
      </div>
      <div className="flex items-center space-x-2 text-white">
        <button aria-label="share" onClick={handleShare} className="focus:outline-none">
          <AnimatedIcon Icon={MdRepeat} active={shared} activeColor="text-blue-500" pulse={sharePulse} />
        </button>
        <span>1.5K</span>
      </div>
    </>
  );
}
