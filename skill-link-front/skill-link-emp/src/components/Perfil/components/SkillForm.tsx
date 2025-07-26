import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import type { Skill } from '../types/ProfileTypes';

interface SkillFormProps {
  initialData?: Skill | null;
  onSubmit: (skill: Omit<Skill, 'id'>) => void;
  onCancel: () => void;
}

export const SkillForm: React.FC<SkillFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    level: 'Principiante' as Skill['level'],
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        level: initialData.level,
        category: initialData.category
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la habilidad es obligatorio';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      level: formData.level,
      category: formData.category.trim()
    });

    // Reset form
    setFormData({
      name: '',
      level: 'Principiante',
      category: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const levels: Skill['level'][] = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];

  const levelColors = {
    'Principiante': 'from-green-500 to-emerald-500',
    'Intermedio': 'from-yellow-500 to-orange-500',
    'Avanzado': 'from-orange-500 to-red-500',
    'Experto': 'from-purple-500 to-indigo-500'
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10 max-w-3xl mx-auto">
      <h3 className="text-white font-medium mb-6 text-lg">
        {initialData ? 'Editar Habilidad' : 'Nueva Habilidad'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Nombre de la habilidad
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="JavaScript, Trading"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
            {errors.name && (
              <p className="text-red-300 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Categoría
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="Web, Marketing..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            />
            {errors.category && (
              <p className="text-red-300 text-sm mt-1">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-3">
            Nivel de experiencia
          </label>
          <div className="grid grid-cols-2 gap-4">
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleInputChange('level', level)}
                className={`p-4 rounded-lg border transition-all duration-200 text-sm font-medium ${
                  formData.level === level
                    ? `border-transparent bg-gradient-to-r ${levelColors[level]} text-white shadow-lg`
                    : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 bg-cyan-500 text-white py-3 px-6 rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
          >
            <Save className="w-4 h-4" />
            <span>{initialData ? 'Actualizar' : 'Agregar'}</span>
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center space-x-2 bg-white/10 text-white py-3 px-6 rounded-lg hover:bg-white/20 transition-colors duration-200 font-medium"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
        </div>
      </form>
    </div>
  );
};