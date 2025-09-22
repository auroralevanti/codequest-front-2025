"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MdClose } from 'react-icons/md';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { AvatarComponent } from '../avatar/Avatar';

interface EditData {
  postId?: string;
  title: string;
  content: string;
  images: string[];
  categoryId?: string;
  tagIds: string[];
}

interface CreatePostProps {
  onClose?: () => void;
  editData?: EditData;
  isEditing?: boolean;
}

export default function CreatePost({ onClose, editData, isEditing = false }: CreatePostProps) {
  const [text, setText] = useState(editData?.content || '');
  const [title, setTitle] = useState(editData?.title || '');
  const [submitting, setSubmitting] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(editData?.categoryId || null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(editData?.tagIds || []);
  const [images, setImages] = useState<string[]>(editData?.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const userData = getUserCookie();
  const username = userData?.username;

  
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
        console.log('Error al obtener data: ',e)
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (submitting || isUploading) return;
    if (!title.trim() && !text.trim()) {
      alert('Debe contener título');
      return;
    }

    setSubmitting(true);
    try {
      const token = getUserCookie()?.token;
      const payload: Record<string, unknown> = {
        title: title.trim(),
        content: text.trim(),
        status: 'published'
      };
      
      if (selectedCategoryId) payload.categoryIds = [selectedCategoryId];
      if (selectedTagIds.length) payload.tagIds = selectedTagIds;
      if (images.length) payload.images = images;

      const url = isEditing && editData?.postId 
        ? `https://codequest-backend-2025.onrender.com/api/v1/posts/${editData.postId}` 
        : apiUrls.posts.create();
      
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `Failed to ${isEditing ? 'update' : 'create'} post`);
      }

      const result = await res.json();
      console.log('Resultado de actualizar?: ', result );
      try { 
        window.dispatchEvent(new CustomEvent('post:updated', { detail: result })); 
      } catch { }
      
      alert(isEditing ? 'Post actualizado correctamente' : 'Post creado correctamente');
      onClose && onClose();
    } catch (e) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} post`, e);
      alert(`Error al ${isEditing ? 'actualizar' : 'crear'} post`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto px-4">
      <div className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col pt-4">
        <header className="p-4 flex items-center justify-between border-b border-light-token dark:border-dark-token">
          <button className="text-text-light dark:text-text-dark" onClick={() => onClose && onClose()}>
            <MdClose />
          </button>
          <h1 className="text-lg font-semibold text-black">
            {isEditing ? 'Editar Post' : 'Enviar Post'}
          </h1>
          <Button
            onClick={handleSubmit}
            disabled={submitting || isUploading || (!title.trim() && !text.trim())}
            className="bg-background text-white font-medium py-1.5 px-4 text-sm hover:bg-accent-background hover:text-black transition-colors"
          >
            {submitting 
              ? (isEditing ? 'Actualizando...' : 'Posteando...') 
              : (isEditing ? 'Actualizar Post' : 'Crear Post')
            }
          </Button>
        </header>

        {/* Rest of your existing component JSX remains the same */}
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

        {/* Footer with categories and tags - keep your existing footer */}
        <footer className="bg-background-light dark:bg-background-dark rounded-t-2xl shadow-lg">
          {/* Your existing footer content */}
        </footer>
      </div>
    </div>
  );
}