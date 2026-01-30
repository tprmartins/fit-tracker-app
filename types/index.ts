export type Role = 'personal' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Student extends User {
  role: 'student';
  personalId: string; // ID of the trainer
}

export interface PersonalTrainer extends User {
  role: 'personal';
}
