import { useState, useEffect } from 'react';
import type { Skill } from '../types/ProfileTypes';

const SKILLS_STORAGE_KEY = 'user_skills';

export const useSkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  // Cargar habilidades del localStorage al inicializar
  useEffect(() => {
    const savedSkills = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (error) {
        console.error('Error parsing saved skills:', error);
      }
    }
  }, []);

  // Guardar habilidades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
  }, [skills]);

  const addSkill = (skillData: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    setSkills(prev => [...prev, newSkill]);
  };

  const removeSkill = (skillId: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
  };

  const editSkill = (skillId: string, updatedData: Omit<Skill, 'id'>) => {
    setSkills(prev => prev.map(skill => 
      skill.id === skillId 
        ? { ...updatedData, id: skillId }
        : skill
    ));
  };

  return {
    skills,
    addSkill,
    removeSkill,
    editSkill
  };
};