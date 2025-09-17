"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUserCookie } from '@/lib/cookies';

export default function DiscordCallbackPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse token and user data from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const username = params.get('username');
        const email = params.get('email');
        const avatar = params.get('avatar');
        const role = params.get('role');

        if (token) {
          // If we have user data from URL params, use it
          if (userId && email) {
            setUserCookie({
              id: userId,
              username: username || '',
              name: username || '',
              email: email,
              roles: (role as 'admin' | 'user') || 'user',
              role: (role as 'admin' | 'user') || 'user',
              avatar: avatar || undefined,
              token
            });
          } else {
            // Otherwise, try to fetch user data using the token
            try {
              const response = await fetch('https://codequest-backend-2025.onrender.com/api/v1/auth/profile', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if (response.ok) {
                const userData = await response.json();
                setUserCookie({
                  id: userData.id,
                  username: userData.username,
                  name: userData.name || userData.username,
                  email: userData.email,
                  roles: userData.roles || 'user',
                  role: userData.role || userData.roles || 'user',
                  avatar: userData.avatar,
                  token
                });
              } else {
                // Fallback with minimal data
                setUserCookie({
                  id: '',
                  username: '',
                  name: '',
                  email: '',
                  roles: 'user',
                  role: 'user',
                  token
                });
              }
            } catch (fetchError) {
              console.error('Error fetching user profile:', fetchError);
              // Fallback with minimal data
              setUserCookie({
                id: '',
                username: '',
                name: '',
                email: '',
                roles: 'user',
                role: 'user',
                token
              });
            }
          }

          // Small delay to ensure cookie write and then redirect
          setTimeout(() => {
            router.push('/blog');
          }, 300);
        } else {
          setError('No se recibió token de autenticación');
          setTimeout(() => {
            router.push('/login?error=discord_auth_failed');
          }, 2000);
        }
      } catch (error) {
        console.error('Error processing Discord callback:', error);
        setError('Error procesando autenticación con Discord');
        setTimeout(() => {
          router.push('/login?error=discord_auth_failed');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando inicio de sesión con Discord...</p>
        <p className="text-sm text-gray-500 mt-2">Por favor espera...</p>
      </div>
    </div>
  );
}
