'use client'

import Image from "next/image";

import { SubmitHandler, useForm } from "react-hook-form";

import devi from "../../../public/devi-hello.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";


interface LoginForm {
  email: string;
  password: string;
};

export default function LoginPage() {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>();


  const submitLogin: SubmitHandler<LoginForm> = async ({ email, password }: LoginForm) => {
    console.log(email, password);

    const url = 'https://codequest-backend-2025.onrender.com/api/v1/auth/login';

    try {
      
      const toLogin = await fetch( url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({email, password})
      });

      const resp = await toLogin.json();
      console.log(resp);

   /*    if( resp.status === 401 ){
        alert('Error en email o password');
      }; */
      if( resp ){
        alert('Bienvenido');
        router.push('/blog')
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
        <div className="flex justify-center text-2xl text-white pb-5">
          <b>Ingresar al blog de DevTalles</b>
        </div>
        <div>
          <form onSubmit={handleSubmit(submitLogin)}>
            <Input
              className="text-white mt-2"
              placeholder="Correo Electronico"
              {...register('email', { required: true })}
            >
            </Input>
            <Input
              className="text-white mt-2 w-<70>"
              placeholder="Contraseña"
              {...register('password', { required: true })}
            >
            </Input>
            <div className="flex justify-center">
              <Button 
              className="bg-accent-background mt-5 mb-5"
              type='submit'
              >
                Ingreso
              </Button>

            </div>
          </form>
          <div className="flex items-center mb-5">
            <Separator className="flex-grow border-gray-300 border-1 mr-1" />
              <span className="text-white">&nbsp; o continua con &nbsp;</span>
            <Separator className="flex-grow border-gray-300 border-1 ml-1" />
          </div>
          <div className="text-white mb-10 justify-center items-center">
            <Button 
            variant='outline'
            className="justify-center items-center">
              Discord
            </Button>
          </div>
          <div className="flex flex-row mb-10">
            <p className="text-white">¿Quieres ser miembro? &nbsp;</p>
            <Link href='/' passHref>
              <p className="text-accent-background font-bold">Inicia el Registro gratis</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}