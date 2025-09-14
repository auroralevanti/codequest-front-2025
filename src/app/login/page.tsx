'use client'

import Image from "next/image";

import { SubmitHandler, useForm } from "react-hook-form";

import devi from "../../../public/devi-hello.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { redirect } from "next/navigation";


interface LoginForm {
  user: string;
  password: string;
};

export default function LoginPage() {

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();


  const submitLogin: SubmitHandler<LoginForm> = ({ user, password }: LoginForm) => {
    console.log(user, password);
    redirect('/blog')
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
              {...register('user', { required: true })}
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
              <span className="text-white">o continua con </span>
            <Separator className="flex-grow border-gray-300 border-1 ml-1" />
          </div>
          <div className="text-white mb-10 justify-center items-center">
            Discord / GitHub
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