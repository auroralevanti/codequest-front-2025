'use client';

import { useEffect, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FaTimes } from 'react-icons/fa';

import { NewPostForm as NewPostFormType } from '@/types/forms';
import { getUserCookie } from '@/lib/cookies';
import router from 'next/router';
import { apiUrls } from '@/config/api';

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

const initialCategories: Category[] = [];
const initialTags: Tag[] = [];

interface NewPostFormProps {
  submitForm: (data: NewPostFormType) => void;
  onCancel: () => void;
}

export const NewPostForm = ({ submitForm, onCancel }: NewPostFormProps) => {

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<Category[]>(initialCategories);
  const [availableTags, setAvailableTags] = useState<Tag[]>(initialTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [closeForm, setCloseForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset, getValues } = useForm<NewPostFormType>();

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setValue('category', categoryName);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => {
      const next = prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId];
      setValue('tagIds', next);
      return next;
    });
  };

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          fetch(apiUrls.categories.list()),
          fetch(apiUrls.tags.list()),
        ]);
        const catsJson = await catsRes.json();
        const tagsJson = await tagsRes.json();
        // API may return arrays or { items: [] }
        const cats = Array.isArray(catsJson) ? catsJson : catsJson.categories || catsJson.items || [];
        const tags = Array.isArray(tagsJson) ? tagsJson : tagsJson.tags || tagsJson.items || [];
        setAvailableCategories(cats.map((c: any) => ({ id: c.id, name: c.name })));
        setAvailableTags(tags.map((t: any) => ({ id: t.id, name: t.name })));
      } catch (err) {
        console.error('Error fetching categories/tags', err);
      }
    };
    fetchMeta();
  }, []);

  const submitNewPost: SubmitHandler<NewPostFormType> = async ({ title, content, slug, category, tagIds}: NewPostFormType) => {
    if (!selectedCategory) {
      alert('Por favor selecciona una categoría');
      return;
    };
    
    const url = apiUrls.posts.create();
    console.log(title, content, slug, category, tagIds);
    
    const userData = getUserCookie();
    const token = userData?.token;
    console.log('User token:', token);
  const status = 'published';

    try {
      const tagsToSend = selectedTags && selectedTags.length ? selectedTags : tagIds;
      const newPost = await fetch( url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, slug, category: selectedCategory || category, tagIds: tagsToSend, status })
      });

      const resp = await newPost.json();

      if (resp && resp.id ) {
        alert('Post creado con exito');
        reset();
        onCancel();
        return;
      }

      if (resp.message) {
        alert(resp.message);
      } else {
        alert('Error al crear el post. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.log({ error });
      alert('Problemas con el servidor');
    }
    
    
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Crear Nuevo Post</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              // Ask to save as draft when closing
              const saveDraft = confirm('Deseas guardar tu post como borrador?');
              if (saveDraft) {
                const vals = getValues();
                const payload = {
                  title: vals.title,
                  content: vals.content,
                  slug: vals.slug,
                  category: vals.category || selectedCategory,
                  tagIds: selectedTags.length ? selectedTags : vals.tagIds,
                } as NewPostFormType;
                try {
                  const token = getUserCookie()?.token;
                  const res = await fetch(apiUrls.posts.create(), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ...payload, status: 'draft' })
                  });
                  const data = await res.json();
                  if (data && data.id) {
                    alert('Borrador guardado');
                    reset();
                    onCancel();
                    return;
                  }
                  alert(data?.message || 'No se pudo guardar el borrador');
                } catch (err) {
                  console.error(err);
                  alert('Error al guardar borrador');
                }
              } else {
                onCancel();
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submitNewPost)} className="space-y-6">
            
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <Input
                {...register('title', { 
                  required: 'El título es requerido',
                  minLength: { value: 5, message: 'El título debe tener al menos 5 caracteres' }
                })}
                placeholder="Escribe el título de tu post..."
                className="w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.length === 0 ? (
                  <p className="text-sm text-secondary-light">Cargando categorías...</p>
                ) : (
                  availableCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === category.name 
                          ? 'bg-accent-background text-black' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                    </Badge>
                  ))
                )}
              </div>
              {!selectedCategory && (
                <p className="text-red-500 text-sm mt-1">Por favor selecciona una categoría</p>
              )}
            </div>

            {/* Tags multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.length === 0 ? (
                  <p className="text-sm text-secondary-light">Cargando tags...</p>
                ) : (
                  availableTags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                      className={`cursor-pointer ${selectedTags.includes(tag.id) ? 'bg-accent-background text-black' : 'hover:bg-gray-100'}`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <textarea
                {...register('content', { 
                  required: 'El contenido es requerido',
                  minLength: { value: 10, message: 'El contenido debe tener al menos 10 caracteres' }
                })}
                placeholder="Escribe el contenido de tu post..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-background focus:border-transparent resize-none"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-between space-x-3 pt-4">
              <Button
                type="button"
                variant='outline'
                onClick={async () => {
                  const saveDraft = confirm('Deseas guardar tu post como borrador?');
                  if (saveDraft) {
                    const vals = getValues();
                    try {
                      const token = getUserCookie()?.token;
                      const res = await fetch(apiUrls.posts.create(), {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          title: vals.title,
                          content: vals.content,
                          slug: vals.slug,
                          category: vals.category || selectedCategory,
                          tagIds: selectedTags.length ? selectedTags : vals.tagIds,
                          status: 'draft'
                        })
                      });
                      const data = await res.json();
                      if (data && data.id) {
                        alert('Borrador guardado');
                        reset();
                        onCancel();
                        return;
                      }
                      alert(data?.message || 'No se pudo guardar el borrador');
                    } catch (err) {
                      console.error(err);
                      alert('Error al guardar borrador');
                    }
                  } else {
                    onCancel();
                  }
                }}
                className="px-6 bg-white border-2 border-accent-background"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 bg-darker-purple hover:bg-background text-white"
              >
                Crear Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
