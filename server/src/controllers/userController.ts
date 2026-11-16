import { Request, Response } from 'express';
import { User, RewardHistory, UserQuest, Achievement } from '../models';
import { HttpError } from '../middleware/errorHandler';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId)
    .populate('achievements', 'slug title description icon rarity xpReward')
    .lean();

  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
  res.json({ data: user });
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;

  const [user, rewardCount, questsCompleted] = await Promise.all([
    User.findById(userId).lean(),
    RewardHistory.countDocuments({ userId }),
    UserQuest.countDocuments({ userId, completed: true }),
  ]);

  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  res.json({
    data: {
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      streakDays: user.streakDays,
      lastActivityDate: user.lastActivityDate,
      totalRewards: rewardCount,
      questsCompleted,
      achievementCount: user.achievements.length,
    },
  });
};

export const getActivity = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  const activity = await RewardHistory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ data: activity });
};

export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const user = await User.findOne({ username })
    .select('-accessToken')
    .populate('achievements', 'slug title description icon rarity')
    .lean();

  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  // Count unlocked achievements
  const achievementSlugs = (user.achievements as unknown as { slug: string }[]).map(
    (a) => a.slug,
  );
  const allAchievements = await Achievement.find().lean();

  res.json({
    data: {
      ...user,
      allAchievements: allAchievements.map((a) => ({
        ...a,
        unlocked: achievementSlugs.includes(a.slug),
      })),
    },
  });
};
