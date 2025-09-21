'use client'

import Image from "next/image";

import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";

import devi from "../../../../../public/devi-laptop.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiUrls } from "@/config/api";
import { getUserCookie } from "@/lib/cookies";


interface CategoryForm {
  name: string;
  slug: string;
};


export default function RegisterNewCategoryPage() {

  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryForm>();
  
  
  const submitLogin: SubmitHandler<CategoryForm> = async ({ name, slug }: CategoryForm) => {
  console.log(name, slug);
 
  const userData = getUserCookie();
  const token = userData?.token;
  const url = 'https://codequest-backend-2025.onrender.com/api/v1/categories';
  
  try {
    
    const toLogin = await fetch( url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({name, slug})
    });
  
    const resp = await toLogin.json();
    console.log(resp);
  

    if( resp.name === name ){
      alert('Categoría creada exitosamente');
      reset();
    };
  
    if (resp.message === 'Unauthorized' ) {
      alert('Usuario no puede crear categoria');
    };
    if (resp.message === 'Category slug already exists' ) {
      alert('Categoria ya existe');
    };
    
  
  } catch (error) {
    console.log({error});
    alert('Problemas con el servidor');
  }
  
  };
  
  return (
    <div className="flex h-full">
      <div className=" flex flex-col sm:mx-auto sm:w-full sm:max-w-sm border-accent-background border-2 rounded-2xl mt-10 mb-10 justify-center items-center">
        <div className=" mt-10 w-50 pb-10">
          <Image
            src={devi.src}
            alt='Devi'
            width={devi.width}
            height={devi.height}
          />
        </div>
        <div className="flex justify-center text-2xl text-background pb-5">
          <h3 className="text-center"><b>Crear Nueva categoría para el blog</b></h3>
        </div>
        <div>
          <form
            className="px-4"
           onSubmit={handleSubmit(submitLogin)}>
            <Input
              className="text-black mt-2"
              placeholder="Nombre de la nueva categoría"
              {...register('name', { 
                required: 'Campo obligatorio',
                pattern: {
                  value: /^.{1,30}$/,
                  message: 'Máximo 40 caracteres'
                } 
              })}
            >
            </Input>
            {errors.name && ( <p className="text-red-500 text-sm mt-1">{errors.name.message}</p> )}
            <Input
              className="text-black mt-2"
              placeholder="Slug de la nueva categoría"
              {...register('slug', { 
                required: 'Campo obligatorio',
                pattern: {
                  value: /^.{1,30}$/,
                  message: 'El slug no es válido. Máximo 40 caracteres'
                } 
              })}
            >
            </Input>
            {errors.slug && ( <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p> )}
        
            <div className="flex flex-col justify-center items-center">
              <Button 
              className="bg-accent-background mt-5 mb-5 hover:bg-background hover:text-white"
              type='submit'
              >
                Crear categoría
              </Button>

            <p >Una vez creada la categoria con su slug podrás agregar otra, el formulario se resetea automáticamente.</p>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}