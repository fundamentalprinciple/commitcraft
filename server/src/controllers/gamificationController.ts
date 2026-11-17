import { Request, Response } from 'express';
import { User, RewardHistory, Achievement } from '../models';
import { HttpError } from '../middleware/errorHandler';
import { getUserQuests, claimQuestReward } from '../services/quest/questService';

export const getGamificationStats = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId).lean();
  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  res.json({
    data: {
      xp: user.xp,
      level: user.level,
      coins: user.coins,
      streakDays: user.streakDays,
      lastActivityDate: user.lastActivityDate,
    },
  });
};

export const getRewardHistory = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const history = await RewardHistory.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({ data: history });
};

export const getQuests = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const quests = await getUserQuests(userId);
  res.json({ data: quests });
};

export const claimQuest = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const userQuestId = req.params.userQuestId as string;
  const rewards = await claimQuestReward(userId, userQuestId);
  res.json({ data: rewards, message: 'Rewards claimed!' });
};

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId).select('achievements').lean();
  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  const unlockedIds = new Set(user.achievements.map((id) => String(id)));
  const all = await Achievement.find().lean();

  res.json({
    data: all.map((a) => ({
      ...a,
      unlocked: unlockedIds.has(String(a._id)),
    })),
  });
};
