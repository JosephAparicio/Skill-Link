import React from 'react';
import { Check } from 'lucide-react';
import { 
  Code, 
  DollarSign, 
  Palette, 
  GraduationCap,
  Globe,
  Heart,
  Trophy,
  Leaf,
  Brain,
  Gamepad2
} from 'lucide-react';
import type { UserInterest } from '../../../types/auth';

interface InterestsSelectorProps {
  selectedInterests: UserInterest[];
  onInterestsChange: (interests: UserInterest[]) => void;
}

export const InterestsSelector: React.FC<InterestsSelectorProps> = ({
  selectedInterests,
  onInterestsChange
}) => {
  const interests = [
    { value: 'Tecnología' as UserInterest, label: 'Tecnología', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { value: 'Negocios y Emprendimiento' as UserInterest, label: 'Negocios', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
    { value: 'Arte y Creatividad' as UserInterest, label: 'Arte', icon: Palette, color: 'from-violet-500 to-purple-500' },
    { value: 'Ciencia y Educación' as UserInterest, label: 'Ciencia', icon: GraduationCap, color: 'from-indigo-500 to-purple-500' },
    { value: 'Idiomas y Cultura' as UserInterest, label: 'Idiomas', icon: Globe, color: 'from-emerald-500 to-teal-500' },
    { value: 'Salud y Bienestar' as UserInterest, label: 'Salud', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { value: 'Deportes' as UserInterest, label: 'Deportes', icon: Trophy, color: 'from-orange-500 to-red-500' },
    { value: 'Medio ambiente y Sostenibilidad' as UserInterest, label: 'Ambiente', icon: Leaf, color: 'from-green-500 to-emerald-500' },
    { value: 'Desarrollo Personal' as UserInterest, label: 'Desarrollo', icon: Brain, color: 'from-purple-600 to-indigo-600' },
    { value: 'Video Juegos y Entretenimiento' as UserInterest, label: 'Gaming', icon: Gamepad2, color: 'from-purple-500 to-pink-500' }
  ];

  const handleInterestToggle = (interest: UserInterest) => {
    const isSelected = selectedInterests.includes(interest);
    
    if (isSelected) {
      onInterestsChange(selectedInterests.filter(i => i !== interest));
    } else {
      onInterestsChange([...selectedInterests, interest]);
    }
  };

  return (
    <div>
      <p className="text-white/70 text-sm mb-4">
        {selectedInterests.length} intereses seleccionados
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {interests.map((interest) => {
          const Icon = interest.icon;
          const isSelected = selectedInterests.includes(interest.value);
          
          return (
            <button
              key={interest.value}
              type="button"
              onClick={() => handleInterestToggle(interest.value)}
              className={`relative p-3 rounded-lg border transition-all duration-300 text-center group hover:scale-[1.02] ${
                isSelected
                  ? `border-transparent bg-gradient-to-r ${interest.color} shadow-lg`
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-2 rounded-lg ${
                  isSelected 
                    ? 'bg-white/20' 
                    : 'bg-white/10 group-hover:bg-white/15'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isSelected ? 'text-white' : 'text-white/70'
                  }`} />
                </div>
                
                <span className={`text-xs font-medium leading-tight ${
                  isSelected ? 'text-white' : 'text-white/80'
                }`}>
                  {interest.label}
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};