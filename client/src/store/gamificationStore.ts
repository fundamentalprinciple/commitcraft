import { create } from 'zustand';
import { gamificationApi, type GamificationStats } from '../api/gamification';
import type { UserQuest, Achievement, RewardHistory } from '../types';

interface GamificationState {
  stats: GamificationStats | null;
  quests: UserQuest[];
  achievements: (Achievement & { unlocked: boolean })[];
  history: RewardHistory[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchQuests: () => Promise<void>;
  fetchAchievements: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  claimQuest: (userQuestId: string) => Promise<{ xp: number; coins: number }>;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  stats: null,
  quests: [],
  achievements: [],
  history: [],
  isLoading: false,

  fetchStats: async () => {
    const stats = await gamificationApi.stats();
    set({ stats });
  },

  fetchQuests: async () => {
    set({ isLoading: true });
    try {
      const quests = await gamificationApi.quests();
      set({ quests });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAchievements: async () => {
    set({ isLoading: true });
    try {
      const achievements = await gamificationApi.achievements();
      set({ achievements });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistory: async () => {
    const history = await gamificationApi.history();
    set({ history });
  },

  claimQuest: async (userQuestId: string) => {
    const rewards = await gamificationApi.claimQuest(userQuestId);
    // Refetch quests and stats after claiming
    const [quests, stats] = await Promise.all([
      gamificationApi.quests(),
      gamificationApi.stats(),
    ]);
    set({ quests, stats });
    return rewards;
  },
}));
