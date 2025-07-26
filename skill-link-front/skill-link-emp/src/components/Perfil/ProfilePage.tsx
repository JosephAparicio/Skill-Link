import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { ProfileForm } from './components/ProfileForm';
import { SkillsSection } from './components/SkillsSection';
import { ProfileHeader } from './components/ProfileHeader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SuccessMessage } from './components/SuccessMessage';
import { useProfileData } from './hooks/useProfileData';
import { useSkillsManager } from './hooks/useSkillsManager';
import { useProfileUpdate } from './hooks/useProfileUpdate';
import type { UserProfile } from './types/ProfileTypes';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Obtener el userId de los parámetros de la URL
  const urlUserId = searchParams.get('userId');
  const isOwnProfile = !urlUserId || urlUserId === String(user?.userId);
  
  const {
    profileData,
    loading: profileLoading,
    error: profileError,
    loadProfile
  } = useProfileData();

  const {
    skills,
    addSkill,
    removeSkill,
    editSkill
  } = useSkillsManager();

  const {
    updateProfile,
    loading: updateLoading,
    error: updateError
  } = useProfileUpdate();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileUpdate = async (updatedData: UserProfile) => {
    const success = await updateProfile(updatedData);
    if (success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  };

  if (profileLoading) {
    return <LoadingSpinner />;
  }

  if (profileError) {
    return <ErrorMessage message={profileError} onRetry={loadProfile} />;
  }

  if (!profileData) {
    return <ErrorMessage message="No se pudieron cargar los datos del perfil" onRetry={loadProfile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-purple-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader user={profileData} />
        
        {isOwnProfile && showSuccessMessage && (
          <SuccessMessage 
            message="Perfil actualizado exitosamente" 
            onClose={() => setShowSuccessMessage(false)} 
          />
        )}

        {isOwnProfile && updateError && (
          <ErrorMessage 
            message={updateError} 
            onRetry={() => {}} 
          />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Formulario principal - Solo mostrar si es el propio perfil */}
          {isOwnProfile && (
            <div className="xl:col-span-3">
              <ProfileForm
                initialData={profileData}
                onSubmit={handleProfileUpdate}
                loading={updateLoading}
              />
            </div>
          )}

          {/* Sección de habilidades */}
          <div className={isOwnProfile ? "xl:col-span-2" : "xl:col-span-5"}>
            <SkillsSection
              skills={skills}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              onEditSkill={editSkill}
            />
          </div>
        </div>
      </div>
    </div>
  );
};