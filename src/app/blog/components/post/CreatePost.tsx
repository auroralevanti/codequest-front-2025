"use client"
import React, { useState, useEffect } from 'react';
import UserBadge from './UserBadge';
import { Button } from '@/components/ui/button';
import { MdClose, MdAttachFile, MdCategory, MdLabel, MdAdd } from 'react-icons/md';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';

export default function CreatePost({ onClose }: { onClose?: () => void }) {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          fetch(apiUrls.categories.list()),
          fetch(apiUrls.tags.list()),
        ]);

        if (catsRes.ok) {
          const catsJson = await catsRes.json();
          const cats = Array.isArray(catsJson) ? catsJson : catsJson?.data || catsJson?.items || [];
          setAvailableCategories((cats as Array<Record<string, unknown>>).map((c) => ({ id: String((c as any).id ?? ''), name: String((c as any).name ?? '') })));
        }

        if (tagsRes.ok) {
          const tagsJson = await tagsRes.json();
          const tags = Array.isArray(tagsJson) ? tagsJson : tagsJson?.data || tagsJson?.items || [];
          setAvailableTags((tags as Array<Record<string, unknown>>).map((t) => ({ id: String((t as any).id ?? ''), name: String((t as any).name ?? '') })));
        }
      } catch (e) {
        // ignore errors for now
        // console.error('Failed to load categories/tags', e);
      }
    })();
  }, []);

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col pt-4">
        <header className="p-4 flex items-center justify-between border-b border-light-token dark:border-dark-token">
          <button className="text-text-light dark:text-text-dark" onClick={() => onClose && onClose()}>
            <MdClose />
          </button>
          <h1 className="text-lg font-semibold text-text-light dark:text-text-dark">Create Post</h1>
          <Button
            onClick={async () => {
              if (submitting) return;
              if (!title.trim() && !text.trim()) {
                alert('Please add a title or content for the post.');
                return;
              }
              setSubmitting(true);
              try {
                const token = getUserCookie()?.token;
                const res = await fetch(apiUrls.posts.create(), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                  body: JSON.stringify({ title: title.trim(), content: text.trim(), status: 'published', categoryIds: selectedCategoryId ? [selectedCategoryId] : undefined, tagIds: selectedTagIds.length ? selectedTagIds : undefined }),
                });
                if (!res.ok) {
                  const err = await res.text();
                  throw new Error(err || 'Failed to create post');
                }
                const created = await res.json();
                // let listeners refresh posts
                try { window.dispatchEvent(new CustomEvent('post:created', { detail: created })); } catch {}
                alert('Post created successfully');
                onClose && onClose();
              } catch (e) {
                console.error('CreatePost error', e);
                alert('Error creating post');
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting || (!title.trim() && !text.trim())}
            className="bg-white text-black font-medium py-1.5 px-4 rounded-full text-sm hover:bg-green-600 hover:text-white transition-colors"
          >
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </header>
        <main className="flex-grow p-4">
          <UserBadge />
          <input
            className="w-full mt-3 bg-transparent border-0 focus:ring-0 p-0 text-xl font-semibold text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => alert('Attachment flow not implemented yet')}
                title="Attachment"
                aria-label="Attachment"
                className="flex items-center justify-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token"
              >
                <MdAttachFile className="text-blue-500" size={22} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowCategories(s => !s); setShowTags(false); setSearch(''); }}
                  title="Categories"
                  aria-label="Categories"
                  className="w-full flex items-center justify-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token"
                >
                  <MdCategory className="text-red-500" size={22} />
                </button>

                {showCategories && (
                  <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-card-dark rounded-lg shadow-lg z-20">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="w-full p-2 border border-gray-200 rounded mb-2" />
                    <div className="max-h-48 overflow-auto">
                      {availableCategories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(cat => (
                        <div key={cat.id} className={`p-2 rounded cursor-pointer ${selectedCategoryId === cat.id ? 'bg-accent-background text-black' : 'hover:bg-gray-50'}`} onClick={() => setSelectedCategoryId(cat.id)}>
                          {cat.name}
                        </div>
                      ))}
                      {availableCategories.length === 0 && <div className="text-sm text-secondary-light">No categories</div>}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowTags(s => !s); setShowCategories(false); setSearch(''); }}
                  title="Tags"
                  aria-label="Tags"
                  className="w-full flex items-center justify-center p-3 bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark border-light-token"
                >
                  <MdLabel className="text-green-500" size={22} />
                </button>

                {showTags && (
                  <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-card-dark rounded-lg shadow-lg z-20">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tags..." className="w-full p-2 border border-gray-200 rounded mb-2" />
                    <div className="max-h-48 overflow-auto grid grid-cols-2 gap-2">
                      {availableTags.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map(tag => (
                        <div key={tag.id} className={`p-2 rounded cursor-pointer border ${selectedTagIds.includes(tag.id) ? 'bg-accent-background text-black border-transparent' : 'border-gray-200'}`} onClick={() => {
                          setSelectedTagIds(prev => prev.includes(tag.id) ? prev.filter(x => x !== tag.id) : [...prev, tag.id]);
                        }}>
                          {tag.name}
                        </div>
                      ))}
                      {availableTags.length === 0 && <div className="text-sm text-secondary-light">No tags</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
