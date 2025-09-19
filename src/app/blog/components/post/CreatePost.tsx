"use client"
import React, { useState } from 'react';
import UserBadge from './UserBadge';
import { Button } from '@/components/ui/button';

export default function CreatePost() {
  const [text, setText] = useState('');

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card-light dark:bg-card-dark h-screen flex flex-col">
        <header className="p-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
          <button className="text-text-light dark:text-text-dark">
            <span className="material-icons">close</span>
          </button>
          <h1 className="text-lg font-semibold text-text-light dark:text-text-dark">Create Post</h1>
          <button className="bg-button-disabled-light dark:bg-button-disabled-dark text-button-disabled-text-light dark:text-button-disabled-text-dark font-medium py-1.5 px-4 rounded-full text-sm">Post</button>
        </header>
        <main className="flex-grow p-4">
          <UserBadge />
          <textarea
            className="w-full mt-4 bg-transparent border-0 focus:ring-0 p-0 text-lg text-subtext-light dark:text-subtext-dark placeholder-subtext-light dark:placeholder-subtext-dark"
            placeholder="What do you want to talk about?"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </main>

        <footer className="bg-background-light dark:bg-background-dark rounded-t-2xl shadow-lg">
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>
          <div className="p-4">
            <h2 className="font-semibold text-text-light dark:text-text-dark mb-4">Add to your post</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex items-center">
                  <span className="material-icons text-blue-500">photo_library</span>
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Photo/Video</span>
                </div>
                <span className="material-icons text-subtext-light dark:text-subtext-dark">add</span>
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex items-center">
                  <span className="material-icons text-blue-500">gif_box</span>
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Gif</span>
                </div>
                <span className="material-icons text-subtext-light dark:text-subtext-dark">add</span>
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex items-center">
                  <span className="material-icons text-green-500">poll</span>
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Poll</span>
                </div>
                <span className="material-icons text-subtext-light dark:text-subtext-dark">add</span>
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex items-center">
                  <span className="material-icons text-red-500">article</span>
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Adoption</span>
                </div>
                <span className="material-icons text-subtext-light dark:text-subtext-dark">add</span>
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex items-center">
                  <span className="material-icons text-yellow-500">pets</span>
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Lost Notice</span>
                </div>
                <span className="material-icons text-subtext-light dark:text-subtext-dark">add</span>
              </button>
              <button className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark">
                <div className="flex items-center">
                  <span className="material-icons text-purple-500">event</span>
                  <span className="ml-3 font-medium text-text-light dark:text-text-dark">Event</span>
                </div>
                <span className="material-icons text-subtext-light dark:text-subtext-dark">add</span>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
