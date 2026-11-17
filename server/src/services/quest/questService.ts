import { Quest, UserQuest, User, RewardHistory } from '../../models';
import type { IQuest } from '../../models';
import type { EventType, QuestTarget } from '../../types';
import { logger } from '../../utils/logger';
import { io } from '../../index';

// Map GitHub event types to quest target types
const EVENT_TO_TARGET: Partial<Record<EventType, QuestTarget>> = {
  push: 'commits',
  'pull_request.opened': 'prs',
  'pull_request.merged': 'prs',
  pull_request_review: 'reviews',
  'issues.closed': 'issues',
  release: 'releases',
};

// ── Seed default quests ──────────────────────────────────────
interface QuestSeed {
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'milestone' | 'ai_generated';
  targetType: QuestTarget;
  targetCount: number;
  xpReward: number;
  coinReward: number;
  aiGenerated: boolean;
  isActive: boolean;
  expiresAt?: Date;
  repoContext?: string;
}

const DEFAULT_QUESTS: QuestSeed[] = [
  {
    title: 'First Blood',
    description: 'Make your first commit of the day',
    type: 'daily',
    targetType: 'commits',
    targetCount: 1,
    xpReward: 25,
    coinReward: 10,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'Commit Streak',
    description: 'Push 3 commits today',
    type: 'daily',
    targetType: 'commits',
    targetCount: 3,
    xpReward: 50,
    coinReward: 20,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'The Reviewer',
    description: 'Review a pull request',
    type: 'daily',
    targetType: 'reviews',
    targetCount: 1,
    xpReward: 40,
    coinReward: 15,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'Issue Hunter',
    description: 'Close 2 issues this week',
    type: 'weekly',
    targetType: 'issues',
    targetCount: 2,
    xpReward: 100,
    coinReward: 40,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'PR Machine',
    description: 'Open 3 pull requests this week',
    type: 'weekly',
    targetType: 'prs',
    targetCount: 3,
    xpReward: 150,
    coinReward: 60,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'Code Guardian',
    description: 'Complete 5 code reviews this week',
    type: 'weekly',
    targetType: 'reviews',
    targetCount: 5,
    xpReward: 200,
    coinReward: 75,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'Hundred Commits',
    description: 'Reach 100 total commits',
    type: 'milestone',
    targetType: 'commits',
    targetCount: 100,
    xpReward: 500,
    coinReward: 200,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'PR Legend',
    description: 'Merge 50 pull requests',
    type: 'milestone',
    targetType: 'prs',
    targetCount: 50,
    xpReward: 750,
    coinReward: 300,
    aiGenerated: false,
    isActive: true,
  },
  {
    title: 'Week Warrior',
    description: 'Maintain a 7-day contribution streak',
    type: 'milestone',
    targetType: 'streak',
    targetCount: 7,
    xpReward: 300,
    coinReward: 100,
    aiGenerated: false,
    isActive: true,
  },
];

export async function seedDefaultQuests(): Promise<void> {
  const count = await Quest.countDocuments();
  if (count > 0) return; // already seeded
  await Quest.insertMany(DEFAULT_QUESTS);
  logger.info(`Seeded ${DEFAULT_QUESTS.length} default quests`);
}

// ── Assign active quests to a user ───────────────────────────
export async function assignQuestsToUser(userId: string): Promise<void> {
  const now = new Date();

  // Daily quests expiry: end of today UTC
  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // Weekly quests expiry: next Monday UTC
  const endOfWeek = new Date(now);
  const daysUntilMonday = (8 - endOfWeek.getUTCDay()) % 7 || 7;
  endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilMonday);
  endOfWeek.setUTCHours(0, 0, 0, 0);

  const dailyQuests = await Quest.find({ type: 'daily', isActive: true }).lean();
  const weeklyQuests = await Quest.find({ type: 'weekly', isActive: true }).lean();
  const milestoneQuests = await Quest.find({ type: 'milestone', isActive: true }).lean();

  const existing = await UserQuest.find({ userId }).select('questId').lean();
  const assignedIds = new Set(existing.map((uq) => String(uq.questId)));

  const toCreate: { userId: string; questId: string; progress: number; completed: boolean }[] = [];

  for (const q of dailyQuests) {
    if (!assignedIds.has(String(q._id))) {
      toCreate.push({ userId, questId: String(q._id), progress: 0, completed: false });
    }
  }
  for (const q of weeklyQuests) {
    if (!assignedIds.has(String(q._id))) {
      toCreate.push({ userId, questId: String(q._id), progress: 0, completed: false });
    }
  }
  for (const q of milestoneQuests) {
    if (!assignedIds.has(String(q._id))) {
      toCreate.push({ userId, questId: String(q._id), progress: 0, completed: false });
    }
  }

  if (toCreate.length > 0) {
    await UserQuest.insertMany(toCreate, { ordered: false }).catch(() => {
      // ignore duplicate key errors from race conditions
    });
  }
}

// ── Update quest progress after a GitHub event ───────────────
export async function updateQuestProgress(userId: string, eventType: EventType): Promise<void> {
  const targetType = EVENT_TO_TARGET[eventType];
  if (!targetType) return;

  // Find all incomplete quests for this user targeting this event type
  const userQuests = await UserQuest.find({ userId, completed: false })
    .populate<{ questId: IQuest }>('questId')
    .lean();

  for (const uq of userQuests) {
    const quest = uq.questId as IQuest;
    if (!quest || quest.targetType !== targetType) continue;

    const newProgress = uq.progress + 1;
    const completed = newProgress >= quest.targetCount;

    await UserQuest.findByIdAndUpdate(uq._id, {
      progress: newProgress,
      completed,
      ...(completed ? { completedAt: new Date() } : {}),
    });

    if (completed) {
      logger.info(`Quest completed: "${quest.title}" for user ${userId}`);
      io.to(`user:${userId}`).emit('quest:completed', {
        quest: { _id: quest._id, title: quest.title, type: quest.type },
        rewards: { xp: quest.xpReward, coins: quest.coinReward },
      });
    }
  }
}

// ── Claim quest reward ───────────────────────────────────────
export async function claimQuestReward(userId: string, userQuestId: string): Promise<{ xp: number; coins: number }> {
  const uq = await UserQuest.findOne({
    _id: userQuestId,
    userId,
    completed: true,
    claimedAt: null,
  }).populate<{ questId: IQuest }>('questId');

  if (!uq) throw new Error('Quest not found or already claimed');

  const quest = uq.questId as IQuest;
  uq.claimedAt = new Date();
  await uq.save();

  await User.findByIdAndUpdate(userId, {
    $inc: { xp: quest.xpReward, coins: quest.coinReward },
  });

  await RewardHistory.create({
    userId,
    eventType: 'quest_complete',
    xpGranted: quest.xpReward,
    coinsGranted: quest.coinReward,
    sourceQuestId: quest._id,
    description: `Quest completed: ${quest.title}`,
  });

  return { xp: quest.xpReward, coins: quest.coinReward };
}

// ── Get quests for a user ────────────────────────────────────
export async function getUserQuests(userId: string) {
  await assignQuestsToUser(userId);
  return UserQuest.find({ userId })
    .populate('questId')
    .sort({ completed: 1, createdAt: 1 })
    .lean();
}
