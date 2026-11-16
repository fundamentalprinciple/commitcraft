export interface User {
  _id: string;
  githubId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActivityDate?: string;
  achievements: string[];
  connectedRepos: string[];
  teamId?: string;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  members: User[];
  islandId?: string;
  totalXp: number;
  level: number;
  coins: number;
  inviteCode: string;
  repositories: Repository[];
  createdAt: string;
}

export interface Repository {
  _id: string;
  githubRepoId: number;
  fullName: string;
  description?: string;
  isPrivate: boolean;
  ownerId: string;
  teamId?: string;
  isActive: boolean;
  lastSyncedAt?: string;
}

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

export interface Quest {
  _id: string;
  title: string;
  description: string;
  type: QuestType;
  targetType: QuestTarget;
  targetCount: number;
  xpReward: number;
  coinReward: number;
  expiresAt?: string;
  aiGenerated: boolean;
}

export interface UserQuest {
  _id: string;
  userId: string;
  quest: Quest;
  progress: number;
  completed: boolean;
  completedAt?: string;
  claimedAt?: string;
}

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Achievement {
  _id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  condition: {
    type: string;
    threshold: number;
  };
  xpReward: number;
  unlockedAt?: string;
}

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

export interface Building {
  id: string;
  buildingType: BuildingType;
  level: number;
  position: { x: number; y: number };
  purchasedAt: string;
}

export interface Island {
  _id: string;
  teamId: string;
  buildings: Building[];
  level: number;
  theme: string;
  lastUpdatedAt: string;
}

export type NotificationType =
  | 'reward_earned'
  | 'quest_completed'
  | 'achievement_unlocked'
  | 'island_updated'
  | 'team_activity'
  | 'invitation_received'
  | 'level_up';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface RewardHistory {
  _id: string;
  eventType: string;
  xpGranted: number;
  coinsGranted: number;
  description: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: Pick<User, '_id' | 'username' | 'displayName' | 'avatarUrl' | 'level'>;
  xp: number;
  achievements: number;
  questsCompleted: number;
}

export interface TeamLeaderboardEntry {
  rank: number;
  team: Pick<Team, '_id' | 'name' | 'slug' | 'level'>;
  totalXp: number;
  memberCount: number;
}
