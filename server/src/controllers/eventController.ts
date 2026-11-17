import { Request, Response } from 'express';
import { GithubEvent, Repository } from '../models';
import { HttpError } from '../middleware/errorHandler';

export const getRecentEvents = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  // Find repos owned by this user
  const repos = await Repository.find({ ownerId: userId, isActive: true })
    .select('_id')
    .lean();
  const repoIds = repos.map((r) => r._id);

  const events = await GithubEvent.find({ repoId: { $in: repoIds }, processed: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('repoId', 'fullName')
    .lean();

  res.json({ data: events });
};

export const getEventsByRepo = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const { repoId } = req.params;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

  const repo = await Repository.findOne({ _id: repoId, ownerId: userId, isActive: true }).lean();
  if (!repo) throw new HttpError(404, 'Repository not found', 'REPO_NOT_FOUND');

  const events = await GithubEvent.find({ repoId, processed: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({ data: events });
};
