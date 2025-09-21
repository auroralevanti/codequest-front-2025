'use client'

import Image from "next/image";

import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";

import devi from "../../../../../public/devi-laptop.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiUrls } from "@/config/api";


interface LoginForm {
  username: string,
  email: string;
  password: string;
  avatarUrl?: string;
  roles: string
};


export default function RegisterNewAdminPage() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>();
  
  
  const submitLogin: SubmitHandler<LoginForm> = async ({ username, email, password }: LoginForm) => {
  console.log(username, email, password);
  const roles = 'admin';
  
  const url = apiUrls.auth.signup();
  
  try {
    
    const toLogin = await fetch( url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({username, email, password, roles})
    });
  
    const resp = await toLogin.json();
    console.log(resp);
  
  /*    if( resp.status === 401 ){
      alert('Error en email o password');
    }; */
    if( resp ){
      alert('Bienvenido');
      router.push('/admin/dashboard')
    }
  
    if( resp.message === "Invalid password" ){
      reset()
      alert('Password incorrecto')
    };
  
    if( resp.message[0] === "password must be longer than or equal to 6 characters" ){
      reset()
      alert('Password debe contener al menos 6 caracteres')
    }
  
  
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
          <h3 className="text-center"><b>Registro exclusivo de ususario administrador a la comunidad DevTalles</b></h3>
        </div>
        <div>
          <form onSubmit={handleSubmit(submitLogin)}>
            <Input
              className="text-black mt-2"
              placeholder="Nombre de Usuario"
              {...register('username', { 
                required: 'Campo obligatorio',
                pattern: {
                  value: /^.{1,10}$/,
                  message: 'Máximo 20 caracteres'
                } 
              })}
            >
            </Input>
            {errors.username && ( <p className="text-red-500 text-sm mt-1">{errors.username.message}</p> )}
            <Input
              className="text-black mt-2"
              placeholder="Correo Electronico"
              {...register('email', { 
                required: 'Campo obligatorio',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'El correo no es válido'
                } 
              })}
            >
            </Input>
            {errors.email && ( <p className="text-red-500 text-sm mt-1">{errors.email.message}</p> )}
            <Input
              className="text-black mt-2 w-<70>"
              placeholder="Contraseña"
              type='password'
              {...register('password', {
                required: 'Campo obligatorio',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres' 
                }
               })}
            >
            </Input>
            { errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>) }
            <div className="flex justify-center">
              <Button 
              className="bg-accent-background mt-5 mb-5"
              type='submit'
              >
                Crear usuario
              </Button>

            </div>
          </form>
          <div className="flex flex-row mb-10 text-center">
              <p className="text-background font-bold ">Ser usuario admin es una responsabilidad</p>
          </div>

        </div>
      </div>
    </div>
  );
}