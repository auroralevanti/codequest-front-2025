'use client'
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import devi from "../../public/404-desktop.png";
import devimobile from "../../public/404-mobile.png";

export default function NotFound() {
  return (
    <div className="flex bg-darker-purple w-full min-h-screen items-center justify-center relative overflow-hidden">
      {/* Image container - positioned lower */}
      <div className="absolute left-0 bottom-20 md:relative md:left-auto md:bottom-auto">
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
      
      {/* Message box positioned higher */}
      <div className="absolute right-8 top-70 max-w-md bg-gray-100 rounded-2xl p-8 shadow-xl z-30 md:relative md:right-auto md:top-auto md:-ml-20">
        <p className="text-2xl font-bold text-center">Oh Oh, nuestro devi no encuentra la página solicitada</p>
        <div className="mt-10">
          {/* Your existing content */}
        </div>
      </div>
    </div>
  );
};