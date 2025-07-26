import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import type { UserProfile, ProfileUpdateRequest, ProfileUpdateResponse } from '../types/ProfileTypes';

export const useProfileUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const updateProfile = async (profileData: UserProfile): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('jwt_token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (token && token.trim() !== '') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const updateRequest: ProfileUpdateRequest = {
        name: profileData.name,
        secondName: profileData.secondName,
        email: profileData.email,
        role: profileData.role,
        interests: profileData.interests
      };

      const response = await fetch('https://skill-link-emprendedor-pjof.onrender.com/usuarios/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al actualizar el perfil');
      }

      const data: ProfileUpdateResponse = await response.json();

      if (data.exito && data.usuario) {
        updateUser({
          userId: String(data.usuario.id),
          name: data.usuario.name,
          secondName: data.usuario.secondName,
          email: data.usuario.email,
          role: data.usuario.role,
          interests: data.usuario.interests
        });

        return true;
      } else {
        throw new Error(data.mensaje || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error
  };
};