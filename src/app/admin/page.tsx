'use client'

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SubmitHandler, useForm } from "react-hook-form";
import {  FaLock } from 'react-icons/fa';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/types/forms";
import { Separator } from "@radix-ui/react-separator";
import { getUserCookie, isAdmin, removeUserCookie, setUserCookie, UserData } from "@/lib/cookies";
import { apiUrls } from "@/config/api";

import devi from "../../../public/login-desktop1.png";
import devimobile from "../../../public/login-mobile1.png";


export default function AdminPage() {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>();

  const submitLogin: SubmitHandler<LoginForm> = async ({ email, password }: LoginForm) => {
    console.log(email, password);

    const url = apiUrls.auth.login();

    try {

      const toLogin = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const resp = await toLogin.json();
      console.log(resp);

      if (resp && resp.user && resp.token) {

        setUserCookie({
          id: resp.user.id,
          username: resp.user.username,
          name: resp.user.name || resp.user.username,
          email: resp.user.email,
          roles: resp.user.roles,
          role: resp.user.role || resp.user.roles,
          avatar: resp.user.avatar,
          token: resp.token
        });

        console.log('User data saved to cookies:', resp.user);
        router.push('admin/admin-access/dashboard');
        return;
      };

      if (resp.message === "Invalid password") {
        reset();
        alert('Password incorrecto');
        return;
      };

      if (Array.isArray(resp.message) && resp.message[0] === "password must be longer than or equal to 6 characters") {
        reset();
        alert('Password debe contener al menos 6 caracteres');
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
    };

  };

  return (
    <div className="flex max-w-5xl min-h-screen items-center justify-between relative flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        <Image
          src={devi.src}
          alt='Devi'
          width={devi.width}
          height={devi.height}
          className="h-auto w-auto hidden md:block"
          priority
        />
        <Image
          src={devimobile.src}
          alt='Devi'
          width={devimobile.width}
          height={devimobile.height}
          className="h-auto w-auto block md:hidden"
          priority
        />
      </div>
      <div className="w-full  md:w-5xl max-w-md bg-gray-100 rounded-2xl p-8 shadow -mt-90 md:mt-0 md:-ml-60 z-10">
        <p className="text-2xl font-bold text-center">ACCESO ADMIN</p>
        <p className="text-2xl font-bold text-center">Ingresar al blog de DevTalles</p>

        <div className="mt-10">
          <form
            onSubmit={handleSubmit(submitLogin)}>
            <Input
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black mb-4"
              placeholder="Correo Electronico"
              type='email'
              aria-placeholder="Coloca tu correo electrónico"
              {...register('email', {
                required: 'Campo obligatorio',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'El correo no es válido'
                }
              })}
            >
            </Input>
            {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>)}
            <Input
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black mb-4"
              placeholder="Contraseña"
              type='password'
              aria-placeholder="Coloca el password ya creado"
              {...register('password', {
                required: 'Campo obligatorio',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
            >
            </Input>
            {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>)}
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
            <Separator className="flex-grow border-gray-400 border-1 mr-1" />
            <span className="text-gray-400">&nbsp; o continua con &nbsp;</span>
            <Separator className="flex-grow border-gray-400 border-1 ml-1" />
          </div>
          <div className="flex text-white mb-10 justify-center items-center">
            <Button
              variant='outline'
              className="justify-center items-center"
              onClick={() => window.location.href = apiUrls.auth.discord()}>
              Discord
            </Button>
          </div>
          <div className="flex flex-row mb-10">
            <p className="text-gray-600">¿Quieres ser miembro? &nbsp;</p>
            <Link href='/register' passHref>
              <p className="text-darker-purple font-bold">Inicia el Registro gratis</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}