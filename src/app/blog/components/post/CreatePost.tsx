"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MdClose } from 'react-icons/md';
import { apiUrls } from '@/config/api';
import { getUserCookie } from '@/lib/cookies';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { AvatarComponent } from '../avatar/Avatar';
import { ImageUploadButton } from '@/components/ui/image-upload-button';
import { CategorySelector } from '@/components/ui/category-selector';

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
  const [showTags, setShowTags] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(editData?.categoryId || null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(editData?.tagIds || []);
  const [images, setImages] = useState<string[]>(editData?.images || []);
  const [isUploading, setIsUploading] = useState(false);

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
        const token = getUserCookie()?.token;
        
        const [catsRes, tagsRes] = await Promise.all([
          fetch(apiUrls.categories.list(), {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
          fetch(apiUrls.tags.list(), {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }),
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
    
    // Validation
    if (!title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    // Additional validation for editing
    if (isEditing && !editData?.postId) {
      console.error('[CreatePost] Missing postId for editing');
      alert('ID de post no encontrado');
      return;
    }

    setSubmitting(true);
    try {
      const token = getUserCookie()?.token;
      
      // Log editData for debugging
      console.log('[CreatePost] Edit data:', editData);
      console.log('[CreatePost] isEditing:', isEditing);
      console.log('[CreatePost] Post ID:', editData?.postId);
      
      // Prepare payload with only the fields that should be updated
      const payload: Record<string, unknown> = {
        title: title.trim(),
        content: text.trim()
      };
      
      // Only include status for new posts, not for updates
      if (!isEditing) {
        payload.status = 'published';
      }
      
      // Only include categoryIds if a category is selected
      if (selectedCategoryId) payload.categoryIds = [selectedCategoryId];
      // Only include tagIds if there are tags selected
      if (selectedTagIds.length) payload.tagIds = selectedTagIds;
      // Only include images if there are images uploaded
      if (images.length) payload.images = images;

      // Log payload for debugging
      console.log('[CreatePost] Sending payload:', JSON.stringify(payload, null, 2));

      // Ensure we have a valid postId when editing
      // Use the correct endpoint for updates - byId for PUT/PATCH requests
      const url = isEditing && editData?.postId 
        ? apiUrls.posts.byId(String(editData.postId)) 
        : apiUrls.posts.create();
      
      // Use PUT for updating posts (more widely supported than PATCH)
      const method = isEditing ? 'PUT' : 'POST';
      // Log request details for debugging
      console.log(`[CreatePost] Making ${method} request to ${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log(`[CreatePost] Response from ${method} request to ${url}`, {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries())
      });

      if (!res.ok) {
        let errorMessage = `Failed to ${isEditing ? 'update' : 'create'} post`;
        let errorDetails = '';
        
        try {
          // Try to get error details from response
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
          } else {
            const errorText = await res.text();
            errorDetails = errorText || `${res.status} ${res.statusText}`;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status
          errorDetails = `${res.status} ${res.statusText}`;
        }
        
        // Combine base error message with details
        errorMessage = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
        console.error(`[CreatePost] ${errorMessage}`, {
          url,
          method,
          status: res.status,
          statusText: res.statusText,
          payload: JSON.stringify(payload, null, 2)
        });
        
        throw new Error(errorMessage);
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
      const errorMessage = e instanceof Error ? e.message : String(e);
      alert(`Error al ${isEditing ? 'actualizar' : 'crear'} post: ${errorMessage}`);
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

          <CategorySelector
            categories={availableCategories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
          />

          <div className="mt-3">
            <label className="text-sm text-subtext-light dark:text-subtext-dark mb-1 block">Imágenes añadidas</label>
            <ImageUploadButton 
              onFilesSelected={handleFiles} 
              disabled={isUploading}
              uploading={isUploading}
            />
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