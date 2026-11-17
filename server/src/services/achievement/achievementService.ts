import { Achievement, User, RewardHistory } from '../../models';
import type { IAchievement } from '../../models';
import { logger } from '../../utils/logger';
import { io } from '../../index';

// ── Achievement definitions ──────────────────────────────────
interface AchievementSeed {
  slug: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  condition: {
    type: 'commits' | 'prs_merged' | 'issues_closed' | 'reviews' | 'streak' | 'quests' | 'level' | 'releases';
    threshold: number;
  };
  xpReward: number;
}

const ACHIEVEMENTS: AchievementSeed[] = [
  {
    slug: 'first_blood',
    title: 'First Blood',
    description: 'Make your very first commit',
    icon: '🩸',
    rarity: 'common',
    condition: { type: 'commits', threshold: 1 },
    xpReward: 50,
  },
  {
    slug: 'pumpkin_master',
    title: 'Pumpkin Master',
    description: 'Reach 50 total commits',
    icon: '🎃',
    rarity: 'uncommon',
    condition: { type: 'commits', threshold: 50 },
    xpReward: 150,
  },
  {
    slug: 'harvest_king',
    title: 'Harvest King',
    description: 'Reach 200 total commits',
    icon: '👑',
    rarity: 'rare',
    condition: { type: 'commits', threshold: 200 },
    xpReward: 300,
  },
  {
    slug: 'ghostbuster',
    title: 'Ghostbuster',
    description: 'Close 10 issues',
    icon: '👻',
    rarity: 'uncommon',
    condition: { type: 'issues_closed', threshold: 10 },
    xpReward: 150,
  },
  {
    slug: 'issue_slayer',
    title: 'Issue Slayer',
    description: 'Close 50 issues',
    icon: '⚔️',
    rarity: 'rare',
    condition: { type: 'issues_closed', threshold: 50 },
    xpReward: 300,
  },
  {
    slug: 'monster_merge',
    title: 'Monster Merge',
    description: 'Merge 10 pull requests',
    icon: '🧟',
    rarity: 'uncommon',
    condition: { type: 'prs_merged', threshold: 10 },
    xpReward: 200,
  },
  {
    slug: 'merge_overlord',
    title: 'Merge Overlord',
    description: 'Merge 50 pull requests',
    icon: '💀',
    rarity: 'rare',
    condition: { type: 'prs_merged', threshold: 50 },
    xpReward: 400,
  },
  {
    slug: 'night_owl',
    title: 'Night Owl',
    description: 'Maintain a 7-day contribution streak',
    icon: '🦉',
    rarity: 'uncommon',
    condition: { type: 'streak', threshold: 7 },
    xpReward: 200,
  },
  {
    slug: 'eternal_flame',
    title: 'Eternal Flame',
    description: 'Maintain a 30-day contribution streak',
    icon: '🔥',
    rarity: 'legendary',
    condition: { type: 'streak', threshold: 30 },
    xpReward: 1000,
  },
  {
    slug: 'witchs_apprentice',
    title: "Witch's Apprentice",
    description: 'Complete 10 quests',
    icon: '🧙',
    rarity: 'uncommon',
    condition: { type: 'quests', threshold: 10 },
    xpReward: 150,
  },
  {
    slug: 'grand_wizard',
    title: 'Grand Wizard',
    description: 'Complete 50 quests',
    icon: '🪄',
    rarity: 'rare',
    condition: { type: 'quests', threshold: 50 },
    xpReward: 400,
  },
  {
    slug: 'code_reviewer',
    title: 'Code Reviewer',
    description: 'Submit 10 code reviews',
    icon: '🔍',
    rarity: 'common',
    condition: { type: 'reviews', threshold: 10 },
    xpReward: 100,
  },
  {
    slug: 'shadow_reviewer',
    title: 'Shadow Reviewer',
    description: 'Submit 50 code reviews',
    icon: '🕵️',
    rarity: 'rare',
    condition: { type: 'reviews', threshold: 50 },
    xpReward: 300,
  },
  {
    slug: 'dark_lord',
    title: 'Dark Lord',
    description: 'Reach level 10',
    icon: '🏰',
    rarity: 'rare',
    condition: { type: 'level', threshold: 10 },
    xpReward: 500,
  },
  {
    slug: 'release_overlord',
    title: 'Release Overlord',
    description: 'Publish 5 releases',
    icon: '🚀',
    rarity: 'rare',
    condition: { type: 'releases', threshold: 5 },
    xpReward: 300,
  },
];

export async function seedAchievements(): Promise<void> {
  for (const ach of ACHIEVEMENTS) {
    await Achievement.findOneAndUpdate(
      { slug: ach.slug },
      { $setOnInsert: ach },
      { upsert: true },
    );
  }
  logger.info(`Seeded ${ACHIEVEMENTS.length} achievements`);
}

// ── Check and award achievements for a user ──────────────────
export async function checkAchievements(userId: string): Promise<void> {
  const user = await User.findById(userId)
    .populate<{ achievements: IAchievement[] }>('achievements')
    .lean();
  if (!user) return;

  const unlockedSlugs = new Set(
    (user.achievements as unknown as IAchievement[]).map((a) => a.slug),
  );

  const allAchievements = await Achievement.find().lean();

  // Build user stats for checking conditions
  const { RewardHistory: RH, UserQuest: UQ } = await import('../../models');
  const [commitCount, prMergedCount, issuesClosedCount, reviewCount, questsCompleted, releaseCount] =
    await Promise.all([
      RH.countDocuments({ userId, eventType: 'push' }),
      RH.countDocuments({ userId, eventType: 'pull_request.merged' }),
      RH.countDocuments({ userId, eventType: 'issues.closed' }),
      RH.countDocuments({ userId, eventType: 'pull_request_review' }),
      UQ.countDocuments({ userId, completed: true }),
      RH.countDocuments({ userId, eventType: 'release' }),
    ]);

  const statMap: Record<string, number> = {
    commits: commitCount,
    prs_merged: prMergedCount,
    issues_closed: issuesClosedCount,
    reviews: reviewCount,
    streak: user.streakDays,
    quests: questsCompleted,
    level: user.level,
    releases: releaseCount,
  };

  for (const ach of allAchievements) {
    if (unlockedSlugs.has(ach.slug)) continue;

    const stat = statMap[ach.condition.type] ?? 0;
    if (stat < ach.condition.threshold) continue;

    // Unlock it
    await User.findByIdAndUpdate(userId, {
      $addToSet: { achievements: ach._id },
      $inc: { xp: ach.xpReward },
    });

    await RewardHistory.create({
      userId,
      eventType: 'achievement_unlock',
      xpGranted: ach.xpReward,
      coinsGranted: 0,
      sourceAchievementSlug: ach.slug,
      description: `Achievement unlocked: ${ach.title}`,
    });

    logger.info(`Achievement unlocked for ${userId}: ${ach.title}`);

    io.to(`user:${userId}`).emit('achievement:unlocked', {
      achievement: {
        slug: ach.slug,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        rarity: ach.rarity,
        xpReward: ach.xpReward,
      },
    });
  }
}
