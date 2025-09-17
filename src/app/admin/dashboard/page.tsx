'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@radix-ui/react-separator';
import { 
  FaUsers, 
  FaFileAlt, 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaSearch,
  FaUserPlus,
  FaEye,
  FaUserShield
} from 'react-icons/fa';
import { getUserCookie } from '@/lib/cookies';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: '',
    avatarUrl: ''
  });

  // Get admin token
  const userData = getUserCookie();
  const token = userData?.token;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch('https://codequest-backend-2025.onrender.com/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersResponse.json();
      setUsers(usersData || []);

      // Fetch posts
      const postsResponse = await fetch('https://codequest-backend-2025.onrender.com/api/v1/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const postsData = await postsResponse.json();
      setPosts(postsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: any) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`https://codequest-backend-2025.onrender.com/api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setUsers(users.filter(user => user.id !== userId));
          alert('Usuario eliminado correctamente');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleDeletePost = async (postId: any) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        const response = await fetch(`https://codequest-backend-2025.onrender.com/api/v1/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setPosts(posts.filter(post => post.id !== postId));
          alert('Post eliminado correctamente');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error al eliminar post');
      }
    }
  };

  const handleCreateAdmin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('https://codequest-backend-2025.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newAdminData,
          roles: 'admin'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Admin creado correctamente');
        setNewAdminData({ username: '', email: '', password: '', avatarUrl: '' });
        setShowCreateAdmin(false);
        fetchData(); // Refresh data
      } else {
        alert('Error al crear admin: ' + (result.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error al crear admin');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona usuarios, posts y configuración del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FaUsers className="h-8 w-8 text-blue-600" />
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
                <FaFileAlt className="h-8 w-8 text-green-600" />
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
                <FaUserShield className="h-8 w-8 text-purple-600" />
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
                variant={activeTab === 'users' ? 'default' : 'outline'}
                onClick={() => setActiveTab('users')}
                className="flex items-center gap-2"
              >
                <FaUsers />
                Usuarios
              </Button>
              <Button
                variant={activeTab === 'posts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('posts')}
                className="flex items-center gap-2"
              >
                <FaFileAlt />
                Posts
              </Button>
              <Button
                onClick={() => setShowCreateAdmin(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
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
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/users/${user.id}/edit`, '_blank')}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
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
                        <span>Creado: {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/blog/posts/${post.id}`, '_blank')}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/admin/posts/${post.id}/edit`, '_blank')}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Admin Modal */}
        {showCreateAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUserPlus />
                  Crear Nuevo Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de Usuario
                    </label>
                    <Input
                      type="text"
                      value={newAdminData.username}
                      onChange={(e) => setNewAdminData({...newAdminData, username: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={newAdminData.email}
                      onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <Input
                      type="password"
                      value={newAdminData.password}
                      onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL (Opcional)
                    </label>
                    <Input
                      type="url"
                      value={newAdminData.avatarUrl}
                      onChange={(e) => setNewAdminData({...newAdminData, avatarUrl: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Crear Admin
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateAdmin(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}