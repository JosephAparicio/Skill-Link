import React, { useState } from 'react';
import { Code } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { SkillForm } from './SkillForm';
import { SkillCard } from './SkillCard';
import type { Skill } from '../types/ProfileTypes';

interface SkillsSectionProps {
  skills: Skill[];
  onAddSkill: (skill: Omit<Skill, 'id'>) => void;
  onRemoveSkill: (skillId: string) => void;
  onEditSkill: (skillId: string, updatedSkill: Omit<Skill, 'id'>) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onAddSkill,
  onRemoveSkill,
  onEditSkill
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const urlUserId = searchParams.get('userId');
  const isOwnProfile = !urlUserId || urlUserId === String(user?.userId);

  const handleAddSkill = (skillData: Omit<Skill, 'id'>) => {
    onAddSkill(skillData);
    setShowForm(false);
  };

  const handleEditSkill = (skillData: Omit<Skill, 'id'>) => {
    if (editingSkill) {
      onEditSkill(editingSkill.id, skillData);
      setEditingSkill(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    setShowForm(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-cyan-500/20 p-2 rounded-lg">
          <Code className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          Habilidades
        </h2>
      </div>

      {isOwnProfile && (showForm || editingSkill) && (
        <div className="mb-6">
          <SkillForm
            initialData={editingSkill}
            onSubmit={editingSkill ? handleEditSkill : handleAddSkill}
            onCancel={handleCancelEdit}
          />
        </div>
      )}

      <div className="space-y-3">
        {skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {isOwnProfile ? 'Sin habilidades aún' : 'Sin habilidades registradas'}
            </h3>
            <p className="text-white/70 mb-6 max-w-sm mx-auto">
              {isOwnProfile 
                ? 'Agrega tus habilidades técnicas y profesionales para destacar tu perfil'
                : 'Este usuario no ha agregado habilidades aún'
              }
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center space-x-2 bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-medium"
              >
                <span>+</span>
                <span>Agregar primera habilidad</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => setEditingSkill(skill)}
                onDelete={() => onRemoveSkill(skill.id)}
                isOwnProfile={isOwnProfile}
              />
            ))}
            
            {isOwnProfile && !showForm && !editingSkill && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-cyan-500/20 text-cyan-300 py-3 px-4 rounded-lg hover:bg-cyan-500/30 transition-colors duration-200 border border-cyan-500/30"
                >
                  <span>+</span>
                  <span>Agregar habilidad</span>
                </button>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-white/60 text-sm">
              <div className="w-2 h-2 bg-cyan-400/60 rounded-full"></div>
              <span>
                {isOwnProfile 
                  ? 'Las habilidades se guardan localmente'
                  : 'Habilidades del usuario'
                }
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};