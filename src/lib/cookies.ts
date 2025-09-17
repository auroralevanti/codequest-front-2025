// Cookie utility functions for user authentication

export interface UserData {
  id: string;
  username: string;
  email: string;
  roles: 'admin' | 'user';
  avatar?: string;
  token?: string;
}

const COOKIE_NAME = 'user_data';
const COOKIE_EXPIRES_DAYS = 7; 

export const setUserCookie = (userData: UserData): void => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000));
  
  const cookieValue = encodeURIComponent(JSON.stringify(userData));
  document.cookie = `${COOKIE_NAME}=${cookieValue};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

export const getUserCookie = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = COOKIE_NAME + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        const cookieValue = decodeURIComponent(c.substring(nameEQ.length, c.length));
        return JSON.parse(cookieValue) as UserData;
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        return null;
      }
    }
  }
  return null;
};

export const updateUserCookie = (updates: Partial<UserData>): boolean => {
  const currentUser = getUserCookie();
  if (!currentUser) return false;
  
  const updatedUser = { ...currentUser, ...updates };
  setUserCookie(updatedUser);
  return true;
};

export const removeUserCookie = (): void => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const isUserLoggedIn = (): boolean => {
  return getUserCookie() !== null;
};

export const getUserRole = (): 'admin' | 'user' | null => {
  const userData = getUserCookie();
  return userData?.roles || null;
};

export const getUsername = (): string | null => {
  const userData = getUserCookie();
  return userData?.username || null;
};

export const getUserId = (): string | null => {
  const userData = getUserCookie();
  return userData?.id || null;
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

export const isUser = (): boolean => {
  return getUserRole() === 'user';
};

// Utility to check if user has specific role
export const hasRole = (requiredRole: 'admin' | 'user'): boolean => {
  return getUserRole() === requiredRole;
};

// Get user display info (useful for UI components)
export const getUserDisplayInfo = (): { name: string; role: string; avatar?: string } | null => {
  const userData = getUserCookie();
  if (!userData) return null;
  
  return {
    name: userData.username,
    role: userData.roles,
    avatar: userData.avatar
  };
};

// Validate if cookie data structure is correct
export const validateUserCookie = (): boolean => {
  const userData = getUserCookie();
  if (!userData) return false;
  
  const requiredFields = ['id', 'name', 'email', 'role'];
  return requiredFields.every(field => userData[field as keyof UserData] !== undefined);
};