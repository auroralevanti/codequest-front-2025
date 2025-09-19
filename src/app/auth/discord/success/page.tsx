"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setUserCookie } from '@/lib/cookies';
import { apiUrls } from '@/config/api';

export default function DiscordSuccessPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleDiscordSuccess = async () => {
      try {
        // Parse token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          setError('No se recibió token de autenticación');
          setTimeout(() => {
            router.push('/login?error=discord_auth_failed');
          }, 2000);
          return;
        }

        // Fetch user data using the token
        try {
          const response = await fetch(apiUrls.users.me(), {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Save complete user data with unified interface
            setUserCookie({
              id: userData.id,
              username: userData.username,
              name: userData.username, // Use username as name since User entity doesn't have a name field
              email: userData.email,
              roles: userData.roles,
              role: userData.roles, // Map roles to role for compatibility
              avatar: userData.avatarUrl,
              token
            });

            console.log('Discord login successful, user data saved:', userData);
            
            // Redirect to blog after successful login
            setTimeout(() => {
              router.push('/blog');
            }, 300);
          } else {
            // If profile fetch fails, save minimal data with token
            console.warn('Could not fetch user profile, saving minimal data');
            setUserCookie({
              id: '',
              username: '',
              name: '',
              email: '',
              roles: 'user',
              role: 'user',
              token
            });
            
            // Still redirect to blog - user data can be fetched later
            setTimeout(() => {
              router.push('/blog');
            }, 300);
          }
        } catch (fetchError) {
          console.error('Error fetching user profile:', fetchError);
          
          // Fallback: save minimal data with token
          setUserCookie({
            id: '',
            username: '',
            name: '',
            email: '',
            roles: 'user',
            role: 'user',
            token
          });
          
          // Still redirect to blog
          setTimeout(() => {
            router.push('/blog');
          }, 300);
        }
      } catch (error) {
        console.error('Error processing Discord success:', error);
        setError('Error procesando autenticación con Discord');
        setTimeout(() => {
          router.push('/login?error=discord_auth_failed');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleDiscordSuccess();
  }, [router]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <p className="text-gray-400">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <p className="text-white text-lg mb-2">Procesando inicio de sesión con Discord...</p>
        <p className="text-gray-400">Por favor espera...</p>
        
        <div className="mt-6 flex items-center justify-center space-x-2">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span className="text-blue-400 text-sm">Conectando con Discord</span>
        </div>
      </div>
    </div>
  );
}