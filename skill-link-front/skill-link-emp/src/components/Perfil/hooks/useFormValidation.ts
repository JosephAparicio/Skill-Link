import { useState } from 'react';
import type { ProfileFormData } from '../types/ProfileTypes';

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: ProfileFormData): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.secondName.trim()) {
      newErrors.secondName = 'El apellido es obligatorio';
    } else if (formData.secondName.trim().length < 2) {
      newErrors.secondName = 'El apellido debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'El formato del correo electrónico no es válido';
      }
    }

    // Validar rol
    if (!formData.role) {
      newErrors.role = 'Debes seleccionar un rol';
    }

    // Validar intereses
    if (!formData.interests || formData.interests.length === 0) {
      newErrors.interests = 'Debes seleccionar al menos un interés';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = (field?: string) => {
    if (field) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    } else {
      setErrors({});
    }
  };

  return {
    errors,
    validateForm,
    clearErrors
  };
};