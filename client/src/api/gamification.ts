import api from './client';
import type { UserQuest, Achievement, RewardHistory } from '../types';

export interface GamificationStats {
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActivityDate?: string;
}

export const gamificationApi = {
  stats: () =>
    api.get<{ data: GamificationStats }>('/gamification/stats').then((r) => r.data.data),
  history: (limit = 20) =>
    api.get<{ data: RewardHistory[] }>(`/gamification/history?limit=${limit}`).then((r) => r.data.data),
  quests: () =>
    api.get<{ data: UserQuest[] }>('/gamification/quests').then((r) => r.data.data),
  claimQuest: (userQuestId: string) =>
    api.post<{ data: { xp: number; coins: number } }>(`/gamification/quests/${userQuestId}/claim`).then((r) => r.data.data),
  achievements: () =>
    api.get<{ data: (Achievement & { unlocked: boolean })[] }>('/gamification/achievements').then((r) => r.data.data),
};
