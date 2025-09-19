'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FaUsers, FaFileAlt, FaTrash, FaEdit, FaSearch, FaUserPlus, FaEye, FaUserShield, FaLock } from 'react-icons/fa';
import { getUserCookie, isAdmin, isUserLoggedIn } from '@/lib/cookies';

import { UserData, PostData } from '@/types/api';
import { apiUrls } from '@/config/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');


  useEffect(() => {
    const checkAdminAccess = async () => {

      if (typeof window === 'undefined') return;
      
      setAuthLoading(true);
  
      //const userData = getUserCookie();

    /*console.log('User Data from Cookie:', userData);
      console.log('User Role:', userData?.roles);
      console.log('Is User Logged In:', isUserLoggedIn());
      console.log('Is Admin:', isAdmin()); */
 
      if (!isUserLoggedIn()) {
        console.log('Usuario debe de iniciar sesion');
        router.push('/admin');
        return;
      }


      if (!isAdmin()) {
        console.log('Usuario no es admin');
        router.push('/login'); 
        return;
      }

      console.log('Acceso exitoso');
      setIsAuthorized(true);
      setAuthLoading(false);
    };

    checkAdminAccess();
  }, [router]);

 
  const userData = isAuthorized ? getUserCookie() : null;
  const token = userData?.token;
  console.log('admin token: ', token);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('token de admin: ', token);
      
      if (!token) {
        console.error('No admin token available');
        router.push('/login');
        return;
      }

      const usersResponse = await fetch(apiUrls.users.list(10, 0), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (usersResponse.status === 401 || usersResponse.status === 403) {
        console.error('Unauthorized access');
        alert('Acceso no permitido');
        return;
      }

      const usersData = await usersResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : []);

      const postsResponse = await fetch(apiUrls.posts.list(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (postsResponse.status === 401 || postsResponse.status === 403) {
        console.error('Unauthorized access');
        alert('Acceso no permitido');
        return;
      }

      const postsData = await postsResponse.json();
      console.log('Posts:', postsData);
      const post = postsData.posts;
      console.log('Posts como objetos: ', post);
      setPosts(Array.isArray(post) ? post : []);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error en servidor');
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  useEffect(() => {

    if (!authLoading && isAuthorized) {
      fetchData();
    }
  }, [authLoading, isAuthorized, fetchData]);

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const userData = getUserCookie();
        const token = userData?.token;
        
        const response = await fetch(apiUrls.users.byId(userId), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          alert('No tienes permisos para realizar esta acción');
          router.push('/login');
          return;
        }
        
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('Usuario eliminado correctamente');
        } else {
          alert('Error al eliminar usuario');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        const userData = getUserCookie();
        const token = userData?.token;
        
        const response = await fetch(apiUrls.posts.byId(postId), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          alert('No tienes permisos para realizar esta acción');
          router.push('/login');
          return;
        }
        
        if (response.ok) {
          setPosts(posts.filter(post => post.id !== postId));
          alert('Post eliminado correctamente');
        } else {
          alert('Error al eliminar post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error al eliminar post');
      }
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter((user: UserData) => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredPosts = Array.isArray(posts) ? posts.filter((post: PostData) => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaLock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!authLoading && !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaLock className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <Button onClick={() => router.push('/')}>
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Administrador</h1>
              <p className="text-gray-600">Gestiona usuarios, posts y configuración del sistema</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FaUsers className="h-8 w-8 text-devi-color" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FaFileAlt className="h-8 w-8 text-devi-color" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FaUserShield className="h-8 w-8 text-devi-color" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(user => user.roles?.includes('admin')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'users' ? 'link' : 'ghost'}
                onClick={() => setActiveTab('users')}
                className="flex items-center gap-2"
              >
                <FaUsers />
                Usuarios
              </Button>
              <Button
                variant={activeTab === 'posts' ? 'link' : 'ghost'}
                onClick={() => setActiveTab('posts')}
                className="flex items-center gap-2"
              >
                <FaFileAlt />
                Posts
              </Button>
              <Button
                onClick={() => router.push('/admin/register')}
                className="flex items-center gap-2 bg-accent-background"
              >
                <FaUserPlus />
                Crear Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaUsers />
                Gestión de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <FaUsers className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.username || 'Sin nombre'}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={user.roles?.includes('admin') ? 'default' : 'outline'}>
                            {user.roles || 'user'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
                        className='bg-white border-background'
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/users/${user.id}/edit`, '_blank')}
                        className='bg-white border-accent-background'
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-white text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron usuarios
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'posts' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaFileAlt />
                Gestión de Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{post.title || 'Sin título'}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {post.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Autor: {post.author?.username || 'Desconocido'}</span>
                        <span>Estado: {post.status || 'draft'}</span>
                        <span>Creado: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '—'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/posts/${post.id}`, '_blank')}
                        className='bg-white border-accent-background'
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/posts/${post.id}/edit`, '_blank')}
                        className='bg-white border-accent-background'
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-white text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron posts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}