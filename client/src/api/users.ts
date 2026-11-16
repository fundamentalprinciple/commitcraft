import api from './client';
import type { User, RewardHistory } from '../types';

export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActivityDate?: string;
  totalRewards: number;
  questsCompleted: number;
  achievementCount: number;
}

export const usersApi = {
  me: () =>
    api.get<{ data: User }>('/users/me').then((r) => r.data.data),
  stats: () =>
    api.get<{ data: UserStats }>('/users/me/stats').then((r) => r.data.data),
  activity: (limit = 20) =>
    api.get<{ data: RewardHistory[] }>(`/users/me/activity?limit=${limit}`).then((r) => r.data.data),
  profile: (username: string) =>
    api.get<{ data: User }>(`/users/${username}`).then((r) => r.data.data),
};
