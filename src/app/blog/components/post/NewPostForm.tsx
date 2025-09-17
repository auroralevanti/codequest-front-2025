'use client';

import { useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FaTimes } from 'react-icons/fa';

import { NewPostForm as NewPostFormType } from '@/types/forms';
import { getUserCookie } from '@/lib/cookies';
import router from 'next/router';

const categories = [
  { name: 'React', href: '' },
  { name: 'React Native', href: '' },
  { name: 'NEXTJS', href: '' },
  { name: 'VUE', href: '' },
  { name: 'Angular', href: '' },
  { name: 'Astro', href: '' },
  { name: 'Node', href: '' },
  { name: 'NestJs', href: '' },
  { name: 'Flutter', href: '' },
];

interface NewPostFormProps {
  submitForm: (data: NewPostFormType) => void;
  onCancel: () => void;
}

export const NewPostForm = ({ submitForm, onCancel }: NewPostFormProps) => {

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [closeForm, setCloseForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<NewPostFormType>();

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setValue('category', categoryName);
  };

  const submitNewPost: SubmitHandler<NewPostFormType> = async ({ title, content, slug, category, tagIds}: NewPostFormType) => {
    if (!selectedCategory) {
      alert('Por favor selecciona una categoría');
      return;
    };
    
    const url = 'https://codequest-backend-2025.onrender.com/api/v1/posts';
    console.log(title, content, slug, category, tagIds);
    
    const userData = getUserCookie();
    const token = userData?.token;
    console.log('User token:', token);
    const status = 'draft';

    try {

      const newPost = await fetch( url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, status })
    });
    
    const resp = await newPost.json();
    console.log(resp);

    if (resp && resp.id ) {
   
      alert('Post creado con exito');
      reset();
      onCancel;
      return;
    };

    if (resp.message) {
      alert(resp.message);
    } else {
      alert('Error al iniciar sesión. Inténtalo de nuevo.');
    };

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
            onClick={onCancel}
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
                {categories.map((category) => (
                  <Badge
                    key={category.name}
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
                ))}
              </div>
              {!selectedCategory && (
                <p className="text-red-500 text-sm mt-1">Por favor selecciona una categoría</p>
              )}
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
                onClick={onCancel}
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
