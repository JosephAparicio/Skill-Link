import React from 'react';
import { Shield, Users } from 'lucide-react';
import type { UserRole } from '../../../types/auth';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange
}) => {
  const roles = [
    {
      value: 'Mentor' as UserRole,
      label: 'Mentor',
      description: 'Guía y facilita la comunidad',
      icon: Shield,
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      value: 'Colaborador' as UserRole,
      label: 'Colaborador',
      description: 'Participa activamente en proyectos',
      icon: Users,
      gradient: 'from-cyan-500 to-teal-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.value;
        
        return (
          <button
            key={role.value}
            type="button"
            onClick={() => onRoleChange(role.value)}
            className={`p-4 rounded-lg border transition-all duration-300 text-left group hover:scale-[1.02] ${
              isSelected
                ? `border-transparent bg-gradient-to-r ${role.gradient} shadow-lg`
                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isSelected 
                  ? 'bg-white/20' 
                  : 'bg-white/10 group-hover:bg-white/15'
              }`}>
                <Icon className={`w-5 h-5 ${
                  isSelected ? 'text-white' : 'text-white/70'
                }`} />
              </div>
              
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  isSelected ? 'text-white' : 'text-white/90'
                }`}>
                  {role.label}
                </h4>
                <p className={`text-sm mt-1 ${
                  isSelected ? 'text-white/80' : 'text-white/60'
                }`}>
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};