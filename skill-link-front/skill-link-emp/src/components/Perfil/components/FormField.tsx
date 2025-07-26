import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  icon: Icon,
  error,
  children
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-white font-medium">
        <Icon className="w-4 h-4 text-white/70" />
        <span>{label}</span>
      </label>
      {children}
      {error && (
        <p className="text-red-300 text-sm flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};