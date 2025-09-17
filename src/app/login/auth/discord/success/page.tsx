"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setUserCookie } from '@/lib/cookies';

export default function DiscordSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Save minimal user data with token; frontend can fetch full profile later
      setUserCookie({ id: '', username: '', email: '', roles: 'user', token });
      setTimeout(() => router.push('/blog'), 200);
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Procesando redirección de Discord...</p>
      </div>
    </div>
  );
}
