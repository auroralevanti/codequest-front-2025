"use client"
import React, { useState } from 'react';
import UserBadge from './UserBadge';
import { Button } from '@/components/ui/button';
import { MdClose, MdPhotoLibrary, MdGif, MdPoll, MdArticle, MdPets, MdEvent, MdAdd } from 'react-icons/md';

export default function CreatePost({ onClose }: { onClose?: () => void }) {
  const [text, setText] = useState('');

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col pt-4">
        <header className="p-4 flex items-center justify-between border-b border-light-token dark:border-dark-token">
          <button className="text-text-light dark:text-text-dark" onClick={() => onClose && onClose()}>
            <MdClose />
          </button>
          <h1 className="text-lg font-semibold text-text-light dark:text-text-dark">Create Post</h1>
          <button className="bg-white text-black font-medium py-1.5 px-4 rounded-full text-sm hover:bg-green-600 hover:text-white transition-colors">
            Post
          </button>
        </header>
        <main className="flex-grow p-4">
          <UserBadge />
          <textarea
            className="w-full mt-4 bg-transparent border-0 focus:ring-0 p-0 text-lg text-subtext-light dark:text-subtext-dark placeholder-subtext-light dark:placeholder-subtext-dark resize-none outline-none"
            placeholder="What do you want to talk about?"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </main>

        <footer className="bg-background-light dark:bg-background-dark rounded-t-2xl shadow-lg">
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 rounded-full border-light-token" />
          </div>
          <div className="p-4">
            <h2 className="font-semibold text-text-light dark:text-text-dark mb-4">Add to your post</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token">
                <div className="flex items-center">
                  <MdPhotoLibrary className="text-blue-500" />
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Photo/Video</span>
                </div>
                <MdAdd className="text-subtext-light dark:text-subtext-dark" />
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token">
                <div className="flex items-center">
                  <MdGif className="text-blue-500" />
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Gif</span>
                </div>
                <MdAdd className="text-subtext-light dark:text-subtext-dark" />
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token">
                <div className="flex items-center">
                  <MdPoll className="text-green-500" />
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Poll</span>
                </div>
                <MdAdd className="text-subtext-light dark:text-subtext-dark" />
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token">
                <div className="flex items-center">
                  <MdArticle className="text-red-500" />
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Adoption</span>
                </div>
                <MdAdd className="text-subtext-light dark:text-subtext-dark" />
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token">
                <div className="flex items-center">
                  <MdPets className="text-yellow-500" />
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Lost Notice</span>
                </div>
                <MdAdd className="text-subtext-light dark:text-subtext-dark" />
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token">
                <div className="flex items-center">
                  <MdEvent className="text-purple-500" />
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Event</span>
                </div>
                <MdAdd className="text-subtext-light dark:text-subtext-dark" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
