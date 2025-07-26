import type { UserRole, UserInterest } from '../../../types/auth';

export interface UserProfile {
  id: number;
  name: string;
  secondName: string;
  email: string;
  role: UserRole;
  interests: UserInterest[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Experto';
  category: string;
}

export interface ProfileFormData {
  name: string;
  secondName: string;
  email: string;
  role: UserRole;
  interests: UserInterest[];
}

export interface ProfileUpdateRequest {
  name: string;
  secondName: string;
  email: string;
  role: UserRole;
  interests: UserInterest[];
}

export interface ProfileUpdateResponse {
  mensaje: string;
  exito: boolean;
  usuario?: {
    id: number;
    name: string;
    secondName: string;
    email: string;
    role: UserRole;
    interests: UserInterest[];
  };
}