'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { getUserCookie } from '@/lib/cookies';


interface Category {
  id: string;
  name: string;
  slug: string;
};


export const CategoriesBadge = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const categoriesUrl = 'https://codequest-backend-2025.onrender.com/api/v1/categories'

    const fetchCategories = async () => {

      const userData = getUserCookie();
      const token = userData?.token;

      try {
        const response = await fetch(categoriesUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
           
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('categorias: ', data);
        
        let categoriesArray = [];
        
        if (Array.isArray(data)) {
          
          categoriesArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          
          categoriesArray = data.data;
        } else if (data.categories && Array.isArray(data.categories)) {
          
          categoriesArray = data.categories;
        } else {
          
          categoriesArray = [];
        };

        const mappedCategories: Category[] = categoriesArray.map((category: Category) => ({
          slug: String(category.slug || ''),
          name: String(category.name || '')
        }));

        setCategories(mappedCategories);
        setError(null);

      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Error al cargar categorias');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (slug: string) => {
    router.push(`/blog/categories/${slug}`);
  };

  if (loading) {
    return (
      <div className="flex flex-row text-white mb-4 justify-center gap-2 overflow-x-auto">
        <div className="flex-1 flex flex-row pt-5 pb-4 justify-center">
          <div className="flex flex-row flex-wrap justify-center gap-2 pb-2">
            <Badge variant="outline" className="text-md text-gray-500">
              Cargando categorías...
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-row text-white mb-4 justify-center gap-2 overflow-x-auto">
        <div className="flex-1 flex flex-row pt-5 pb-4 justify-center">
          <div className="flex flex-row flex-wrap justify-center gap-2 pb-2">
            <Badge variant="outline" className="text-md text-red-500">
              Error loading categories
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-row text-white mb-4 justify-center gap-2 overflow-x-auto">
        <div className="flex-1 flex flex-row pt-5 pb-4 justify-center">
          <div className="flex flex-row flex-wrap justify-center gap-2 pb-2">
            <Badge variant="outline" className="text-md text-gray-500">
              No se encontraron categorías
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row text-white mb-4  justify-center gap-2 overflow-x-auto">
      <div className="flex-1 flex flex-row pt-5 pb-4 justify-center">
        <div className="flex flex-row flex-wrap justify-center gap-2 pb-2">
          {categories.map((category) => (
            <Badge 
              key={category.id || category.slug} 
              variant="outline" 
              className="text-md cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors duration-200"
              onClick={() => handleCategoryClick(category.slug)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}