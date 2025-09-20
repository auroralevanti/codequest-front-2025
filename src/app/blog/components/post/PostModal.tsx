'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreatePost from './CreatePost';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostModal = ({ isOpen, onClose }: PostModalProps) => {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="post-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          {/* Blurred backdrop (stronger blur + softer tint) */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-xl"
          />

          <motion.div
            key="post-modal-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md px-4 pb-6 pointer-events-auto"
            style={{ bottom: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto">
              <div className="transform translate-y-0">
                <CreatePost onClose={onClose} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

