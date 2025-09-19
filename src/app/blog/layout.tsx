// https://tailwindcomponents.com/component/tailwind-css-admin-dashboard-layout
// https://gist.github.com/Klerith/3949f1c8b884d7101e378dfb668f0f3a

'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { MdPostAdd, MdExitToApp, MdAdd } from "react-icons/md";
import { AvatarComponent } from "./components/avatar/Avatar";
import { PostModal } from "./components/post/PostModal";
import { useAuth } from "@/contexts/AuthContext";
import { NewPostForm } from "@/types/forms";

import logoDevTalles from "../../../public/LOGOB.svg";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleCreatePost = (data: NewPostForm) => {
    // Here you would typically send the data to your API
    console.log('New post created:', data);
    setIsPostModalOpen(false);
    // You might want to refresh the posts list or add the new post to the state
  };

  return (
    <>
    <div className="bg-background">

    
      <nav className="bg-darker-purple border-b border-darker-purple fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div className="hidden sm:block w-35">
                <Link href='https://cursos.devtalles.com/' passHref>
                  <Image
                    src={ logoDevTalles.src }
                    alt='DevTalles logo'
                    width={ logoDevTalles.width }
                    height={ logoDevTalles.height }
                  />
                </Link>
              </div>
              <span className="hidden sm:inline self-center text-white whitespace-nowrap ml-2">
                <b>DevTalles Blog de usuarios</b>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="text-white p-1 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <AvatarComponent />
              </div>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="hidden sm:inline-flex text-white hover:text-black transition-colors p-2 rounded-full hover:bg-accent-background k hover:bg-opacity-10"
                title="Crear nuevo post"
              >
                <MdPostAdd size={24} />
              </button>
              <button
                onClick={logout}
                className="text-white hover:text-red-300 transition-colors px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2"
                title="Cerrar sesión"
              >
                <MdExitToApp size={18} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* <div className="flex overflow-hidden bg-white pt-16"> */}
        {/* <aside
          id="sidebar"
          className="fixed hidden z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
          aria-label="Sidebar"
        >
          <div className="relative flex-1 flex flex-col min-h-0 borderR border-gray-200 bg-white pt-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 bg-white divide-y space-y-1">
                <ul className="space-y-2 pb-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-base capitalize text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                      >
                        <span className="ml-3">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside> */}
{/*         <div
          className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
          id="sidebarBackdrop"
        ></div> */}
        <div
          id="main-content"
          className="h-full w-full bg-background pt-16 "
        >
          <main>
            <div className="pt-6 px-4">
              <div className="w-full min-h-[calc(100vh-230px)]">
                <div className=" shadow rounded-lg p-4 sm:p-6 xl:p-8">
                  {children}
                </div>
              </div>
            </div>
          </main>
          <footer >
            
            
          </footer>
          <p className="text-center text-sm text-gray-500 my-10">
            &copy; 2019-{new Date().getFullYear()}{" "}
            <a href="#" className="hover:underline" target="_blank">
              Themesberg
            </a>
            . All rights reserved.
          </p>
        </div>
     {/*  </div> */}
      </div>
      
      {/* Post Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      {/* Mobile floating add button */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        title="Crear nuevo post"
        aria-label="Crear nuevo post"
        className="sm:hidden fixed bottom-4 right-4 z-40 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      >
        <MdAdd size={22} />
      </button>
    </>
  );
}