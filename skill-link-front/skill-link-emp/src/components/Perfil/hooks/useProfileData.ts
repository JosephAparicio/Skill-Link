import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import type { UserProfile } from '../types/ProfileTypes';

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const loadProfile = useCallback(async () => {
    if (!user?.userId) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const urlUserId = searchParams.get('userId');
      const isOwnProfile = !urlUserId || urlUserId === String(user.userId);
      
      let url: string;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (isOwnProfile) {
        url = 'https://skill-link-emprendedor-pjof.onrender.com/usuarios/profile';
        const token = sessionStorage.getItem('jwt_token');
        if (token && token.trim() !== '') {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } else {
        url = `https://skill-link-emprendedor-pjof.onrender.com/usuarios/profile/${urlUserId}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado');
        }
        throw new Error('Error al cargar el perfil');
      }

      const data = await response.json();
      
      // Asegurar que usamos el mismo campo 'id' que se usa en los posts
      const profileData: UserProfile = {
        id: data.id || (isOwnProfile ? user.userId : parseInt(urlUserId || '0')),
        name: data.name || user.name,
        secondName: data.secondName || user.secondName,
        email: data.email || user.email,
        role: data.role || user.role,
        interests: data.interests || user.interests || []
      };
      setProfileData(profileData);
    } catch (err) {
      console.error('useProfileData - Error loading profile:', err);
      
      // Solo usar fallback para el propio perfil
      const urlUserId = searchParams.get('userId');
      const isOwnProfile = !urlUserId || urlUserId === String(user.userId);
      
      if (isOwnProfile && user) {
        const fallbackProfile: UserProfile = {
          id: user.userId, // Usar userId como id para consistencia
          name: user.name,
          secondName: user.secondName,
          email: user.email,
          role: user.role,
          interests: user.interests || []
        };
        setProfileData(fallbackProfile);
      } else {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos del perfil');
      }
    } finally {
      setLoading(false);
    }
  }, [user, searchParams]);

  return {
    profileData,
    loading,
    error,
    loadProfile
  };
};