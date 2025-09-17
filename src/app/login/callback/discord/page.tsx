"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setUserCookie } from '@/lib/cookies';

export default function DiscordCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Parse token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // The backend should ideally send user info as well. If only a token is
      // provided, save a minimal UserData object so `setUserCookie` meets the
      // expected shape. The frontend can fetch full profile later using the token.
      setUserCookie({
        id: '',
        username: '',
        email: '',
        roles: 'user',
        token
      });
      // Small delay to ensure cookie write
      setTimeout(() => {
        router.push('/blog');
      }, 200);
    } else {
      // No token present, redirect to login
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Procesando inicio de sesión con Discord...</p>
      </div>
    </div>
  );
}
