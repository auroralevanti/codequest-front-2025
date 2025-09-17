'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { FaHome, FaUsers, FaFileAlt, FaCog, FaSignOutAlt, FaBars, FaTimes, FaLock } from 'react-icons/fa';
import { getUserCookie, removeUserCookie, isAdmin } from '@/lib/cookies';

import { AvatarComponent } from '../blog/components/avatar/Avatar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  // Check authorization on client side only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkAuth = () => {
      const currentUserData = getUserCookie();
      const userIsAdmin = isAdmin();
      
      setUserData(currentUserData);
      setIsAuthorized(userIsAdmin);
      setAuthLoading(false);
      
      if (!userIsAdmin) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    removeUserCookie();
    router.push('/login');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not admin
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaLock className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-700 mb-4">No tienes permisos de administrador</p>
          <Button onClick={() => router.push('/admin')}>
            Ir al Login
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaHome },
    { name: 'Usuarios', href: '/admin/users', icon: FaUsers },
    { name: 'Posts', href: '/admin/posts', icon: FaFileAlt },
    { name: 'Configuración', href: '/admin/settings', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:translate-x-0 lg:flex-shrink-0 min-h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between h-16 px-6 border-b items-center flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation - grows to fill space */}
          <nav className="mt-6 flex-grow">
            <div className="px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 mb-1"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t flex-shrink-0">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
             <AvatarComponent/>
                <span className="text-sm font-medium text-gray-700">
                  {userData?.username?.charAt(0) || 'A'}
                </span>
               </div> 
              <div>
                <p className="text-sm font-medium text-gray-900">{userData?.username || 'Administrador'}</p>
                <p className="text-xs text-gray-500">{userData?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-white flex items-center justify-center"
            >
              <FaSignOutAlt className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <FaBars className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bienvenido, {userData?.username || 'Admin'}
            </span>
          </div>
        </div>

        {/* Page content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}