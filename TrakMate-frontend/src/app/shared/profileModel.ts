export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // 'Pilot' sau 'Admin'
  profileImage?: string; // NOU: URL către imagine
  isActive?: boolean;
  createdAt?: string;
  lapCount?: number;
}