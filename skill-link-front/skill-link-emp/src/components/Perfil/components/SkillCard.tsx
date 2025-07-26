import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import type { Skill } from '../types/ProfileTypes';

interface SkillCardProps {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
  isOwnProfile?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onEdit,
  onDelete,
  isOwnProfile = true
}) => {
  const levelColors = {
    'Principiante': 'from-green-500 to-emerald-500',
    'Intermedio': 'from-yellow-500 to-orange-500',
    'Avanzado': 'from-orange-500 to-red-500',
    'Experto': 'from-purple-500 to-indigo-500'
  };

  const levelEmojis = {
    'Principiante': '🌱',
    'Intermedio': '🌿',
    'Avanzado': '🌳',
    'Experto': '🏆'
  };

  return (
    <div className={`bg-white/5 rounded-lg p-4 border border-white/10 transition-all duration-200 ${isOwnProfile ? 'hover:bg-white/10 group' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <h4 className="text-white font-semibold text-lg truncate">{skill.name}</h4>
            <span className="text-xl flex-shrink-0">
              {levelEmojis[skill.level]}
            </span>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-white/70 text-sm bg-white/10 px-2 py-1 rounded-md">
                {skill.category}
              </span>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${levelColors[skill.level]} text-white text-sm font-medium shadow-sm`}>
                {skill.level}
              </div>
            </div>
          </div>
        </div>

        {/* Solo mostrar botones de edición si es el propio perfil */}
        {isOwnProfile && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
            <button
              onClick={onEdit}
              className="p-2 text-white/60 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Editar habilidad"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200"
              title="Eliminar habilidad"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};