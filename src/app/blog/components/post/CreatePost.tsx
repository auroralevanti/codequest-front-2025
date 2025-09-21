"use client"

import { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { MdClose, MdAttachFile, MdCategory, MdLabel } from 'react-icons/md';

import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { AvatarComponent } from '../avatar/Avatar';

const userData = getUserCookie();
console.log('data:', userData);
const username = userData?.username;

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
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      const results = await Promise.allSettled(files.map(f => uploadToCloudinary(f)));
      const successUrls = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<string>).value);
      const failedCount = results.filter(r => r.status === 'rejected').length;
      if (failedCount) {
        alert(`${failedCount} image(s) failed to upload`);
      }
      if (successUrls.length) {
        setImages(prev => [...prev, ...successUrls]);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  }

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
          setAvailableCategories((cats as Array<Record<string, unknown>>).map((c) => {
            const rec = c as Record<string, unknown>;
            return { id: String(rec['id'] ?? ''), name: String(rec['name'] ?? '') };
          }));
        }

        if (tagsRes.ok) {
          const tagsJson = await tagsRes.json();
          const tags = Array.isArray(tagsJson) ? tagsJson : tagsJson?.data || tagsJson?.items || [];
          setAvailableTags((tags as Array<Record<string, unknown>>).map((t) => {
            const rec = t as Record<string, unknown>;
            return { id: String(rec['id'] ?? ''), name: String(rec['name'] ?? '') };
          }));
        }
      } catch (e) {
        // ignore errors for now
        // console.error('Failed to load categories/tags', e);
      }
    })();
  }, []);

  return (
    <div className="max-w-full md:max-w-2xl lg:max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col pt-4">
        <header className="p-4 flex items-center justify-between border-b border-light-token dark:border-dark-token">
          <button className="text-text-light dark:text-text-dark" onClick={() => onClose && onClose()}>
            <MdClose />
          </button>
          <h1 className="text-lg font-semibold text-black">Enviar Post</h1>
          <Button
            onClick={async () => {
              if (submitting) return;
              if (isUploading) return;
              if (!title.trim() && !text.trim()) {
                alert('Debe contener título');
                return;
              }
              setSubmitting(true);
              try {
                const token = getUserCookie()?.token;
                const payload: Record<string, unknown> = { title: title.trim(), content: text.trim(), status: 'published' };
                if (selectedCategoryId) payload.categoryIds = [selectedCategoryId];
                if (selectedTagIds.length) payload.tagIds = selectedTagIds;
                if (images.length) payload.images = images;

                const res = await fetch(apiUrls.posts.create(), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                  body: JSON.stringify(payload),
                });
                if (!res.ok) {
                  const err = await res.text();
                  throw new Error(err || 'Failed to create post');
                }
                const created = await res.json();
                // let listeners refresh posts
                try { window.dispatchEvent(new CustomEvent('post:created', { detail: created })); } catch { }
                alert('Post creado correctamente');
                onClose && onClose();
              } catch (e) {
                console.error('Error al crear post', e);
                alert('Error al crear post');
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting || isUploading || (!title.trim() && !text.trim())}
            className="bg-background text-white font-medium py-1.5 px-4 text-sm hover:bg-green-600 hover:text-black transition-colors"
          >
            {submitting ? 'Posteando...' : 'Crear Post'}
          </Button>
        </header>
        <main className="flex-grow p-4">
          <div className='flex flex-row'>
          <AvatarComponent />
          <div>
            <p className="font-bold text-black ml-5 mb-1">{username}</p>
          </div>
          </div>
          <input
            className="w-full mt-3 bg-transparent border-0 focus:ring-0 p-0 text-xl font-semibold text-text-light dark:text-text-dark placeholder-subtext-light dark:placeholder-subtext-dark outline-none"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full mt-4 bg-transparent border-0 focus:ring-0 p-0 text-lg text-subtext-light dark:text-subtext-dark placeholder-subtext-light dark:placeholder-subtext-dark resize-none outline-none"
            placeholder="Agrega contenido a tu post"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-3">
            <label className="text-sm text-subtext-light dark:text-subtext-dark mb-1 block">Imágenes añadidas</label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length === 0) return;
                  await handleFiles(files);
                  // clear input
                  (e.target as HTMLInputElement).value = '';
                }}
                className="hidden"
              />
              {isUploading && <span className="text-sm text-gray-500">Cargando...</span>}
            </div>
            <div className="mt-2 flex gap-2">
              {images.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={src} alt={`uploaded-${i}`} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    aria-label={`Remove image ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="bg-background-light dark:bg-background-dark rounded-t-2xl shadow-lg">
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 rounded-full border-light-token" />
          </div>
          <div className="p-4">
            <h2 className="font-semibold text-text-light dark:text-text-dark mb-4">Añadir imagen, categoría o tags al post</h2>

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
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
                      {availableCategories.length === 0 && <div className="text-sm text-secondary-light">No hay categorías</div>}
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
                      {availableTags.length === 0 && <div className="text-sm text-secondary-light">No hay tags</div>}
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
