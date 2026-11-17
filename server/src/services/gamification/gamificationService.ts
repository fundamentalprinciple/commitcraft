import { User, RewardHistory, Team } from '../../models';
import type { EventType, RewardMap } from '../../types';
import { logger } from '../../utils/logger';
import { io } from '../../index';

// ── Reward table (overridable via env) ───────────────────────
const REWARDS: RewardMap = {
  push: {
    xp: parseInt(process.env.REWARD_COMMIT_XP ?? '10'),
    coins: parseInt(process.env.REWARD_COMMIT_COINS ?? '5'),
  },
  'pull_request.opened': {
    xp: parseInt(process.env.REWARD_PR_OPEN_XP ?? '20'),
    coins: 0,
  },
  'pull_request.merged': {
    xp: parseInt(process.env.REWARD_PR_MERGED_XP ?? '50'),
    coins: parseInt(process.env.REWARD_PR_MERGED_COINS ?? '25'),
  },
  'issues.closed': {
    xp: parseInt(process.env.REWARD_ISSUE_CLOSED_XP ?? '15'),
    coins: parseInt(process.env.REWARD_ISSUE_CLOSED_COINS ?? '10'),
  },
  pull_request_review: {
    xp: parseInt(process.env.REWARD_REVIEW_XP ?? '25'),
    coins: 0,
  },
  release: {
    xp: parseInt(process.env.REWARD_RELEASE_XP ?? '100'),
    coins: parseInt(process.env.REWARD_RELEASE_COINS ?? '50'),
  },
};

// ── XP / Level formula ───────────────────────────────────────
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function levelFromXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXp) {
    accumulated += xpForLevel(level);
    level++;
  }
  return level;
}

// ── Streak logic ─────────────────────────────────────────────
function updateStreak(lastActivityDate: Date | undefined, currentStreak: number): number {
  if (!lastActivityDate) return 1;
  const now = new Date();
  const hoursSince =
    (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);
  if (hoursSince < 24) return currentStreak; // same day, no change
  if (hoursSince < 48) return currentStreak + 1; // consecutive day
  return 1; // streak broken
}

// ── Core reward grant ────────────────────────────────────────
export async function grantReward(
  userId: string,
  eventType: EventType,
  sourceEventId: string,
): Promise<void> {
  const reward = REWARDS[eventType as keyof RewardMap];
  if (!reward) {
    logger.debug(`No reward configured for event type: ${eventType}`);
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    logger.warn(`grantReward: user ${userId} not found`);
    return;
  }

  const prevLevel = user.level;
  const newXp = user.xp + reward.xp;
  const newCoins = user.coins + reward.coins;
  const newLevel = levelFromXp(newXp);
  const newStreak = updateStreak(user.lastActivityDate, user.streakDays);

  user.xp = newXp;
  user.coins = newCoins;
  user.level = newLevel;
  user.streakDays = newStreak;
  user.lastActivityDate = new Date();
  await user.save();

  // Record in history
  await RewardHistory.create({
    userId,
    eventType,
    xpGranted: reward.xp,
    coinsGranted: reward.coins,
    sourceEventId,
    description: `Earned from ${eventType.replace(/_/g, ' ').replace(/\./g, ' ')}`,
  });

  // Update team XP
  if (user.teamId) {
    await Team.findByIdAndUpdate(user.teamId, { $inc: { totalXp: reward.xp } });
  }

  logger.info(
    `Reward granted to ${user.username}: +${reward.xp} XP, +${reward.coins} coins (${eventType})`,
  );

  // Emit real-time reward notification
  io.to(`user:${userId}`).emit('reward:earned', {
    xp: reward.xp,
    coins: reward.coins,
    reason: eventType,
    totalXp: newXp,
    totalCoins: newCoins,
    level: newLevel,
  });

  // Emit level-up notification if level changed
  if (newLevel > prevLevel) {
    io.to(`user:${userId}`).emit('reward:earned', {
      xp: 0,
      coins: 0,
      reason: 'level_up',
      level: newLevel,
    });
    logger.info(`${user.username} levelled up to ${newLevel}!`);
  }

  // Kick off quest progress update (Phase 4 will implement fully)
  setImmediate(async () => {
    try {
      const { updateQuestProgress } = await import('../quest/questService');
      await updateQuestProgress(userId, eventType);
    } catch {
      // Quest service not yet implemented – silently skip
    }
  });

  // Kick off achievement check (Phase 4 will implement fully)
  setImmediate(async () => {
    try {
      const { checkAchievements } = await import('../achievement/achievementService');
      await checkAchievements(userId);
    } catch {
      // Achievement service not yet implemented – silently skip
    }
  });
}
