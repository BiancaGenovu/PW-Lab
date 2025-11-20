// src/app/shared/profileModel.ts

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;

  // când a fost creat contul
  createdAt: string | Date;

  // statistici (pot veni sau nu din backend)
  lapCount?: number;     // numărul de tururi înregistrate
  bestLapMs?: number;    // cel mai bun timp în ms

  // info extra – le poți folosi mai târziu
  country?: string;
  team?: string;
  avatarUrl?: string;
}