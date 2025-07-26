import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Shield, Heart } from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { InterestsSelector } from './InterestsSelector';
import { FormField } from './FormField';
import { useFormValidation } from '../hooks/useFormValidation';
import type { UserProfile, ProfileFormData } from '../types/ProfileTypes';

interface ProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: UserProfile) => Promise<void>;
  loading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    secondName: '',
    email: '',
    role: 'Colaborador',
    interests: []
  });

  const { errors, validateForm, clearErrors } = useFormValidation();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        secondName: initialData.secondName,
        email: initialData.email,
        role: initialData.role,
        interests: initialData.interests
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      clearErrors(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    const profileData: UserProfile = {
      id: initialData.id,
      ...formData
    };

    await onSubmit(profileData);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-500/20 p-2 rounded-lg">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          Información Personal
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nombre"
            icon={User}
            error={errors.name}
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Tu nombre"
            />
          </FormField>

          <FormField
            label="Apellido"
            icon={User}
            error={errors.secondName}
          >
            <input
              type="text"
              value={formData.secondName}
              onChange={(e) => handleInputChange('secondName', e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Tu apellido"
            />
          </FormField>
        </div>

        <FormField
          label="Correo Electrónico"
          icon={Mail}
          error={errors.email}
        >
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="tu@email.com"
          />
        </FormField>

        <FormField
          label="Rol en la Comunidad"
          icon={Shield}
          error={errors.role}
        >
          <RoleSelector
            selectedRole={formData.role}
            onRoleChange={(role) => handleInputChange('role', role)}
          />
        </FormField>

        <FormField
          label="Intereses"
          icon={Heart}
          error={errors.interests}
        >
          <InterestsSelector
            selectedInterests={formData.interests}
            onInterestsChange={(interests) => handleInputChange('interests', interests)}
          />
        </FormField>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};