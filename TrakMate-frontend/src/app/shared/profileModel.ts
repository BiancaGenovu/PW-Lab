export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // 'Pilot' sau 'Admin'
  isActive?: boolean;
  createdAt?: string;
  lapCount?: number;
}