export type EventType =
  | 'push'
  | 'pull_request.opened'
  | 'pull_request.merged'
  | 'pull_request.closed'
  | 'issues.opened'
  | 'issues.closed'
  | 'pull_request_review'
  | 'release';

export type QuestType = 'daily' | 'weekly' | 'milestone' | 'ai_generated';

export type QuestTarget = 'commits' | 'prs' | 'reviews' | 'issues' | 'streak' | 'releases';

export type BuildingType =
  | 'haunted_cottage'
  | 'pumpkin_farm'
  | 'graveyard'
  | 'witch_tower'
  | 'haunted_castle'
  | 'dark_cathedral'
  | 'ghost_harbor'
  | 'bone_bridge'
  | 'cursed_forest';

export interface RewardConfig {
  xp: number;
  coins: number;
}

export interface RewardMap {
  push: RewardConfig;
  'pull_request.opened': RewardConfig;
  'pull_request.merged': RewardConfig;
  'issues.closed': RewardConfig;
  pull_request_review: RewardConfig;
  release: RewardConfig;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface User {
      _id: string;
      githubId: string;
      username: string;
      displayName: string;
      avatarUrl: string;
      xp: number;
      level: number;
      coins: number;
      teamId?: string;
    }
  }
}
