import { Request, Response } from 'express';
import { User, Repository, Team } from '../models';
import { HttpError } from '../middleware/errorHandler';
import {
  listUserRepos,
  createWebhook,
  deleteWebhook,
  generateWebhookSecret,
} from '../services/github/githubApiService';
import { connectRepoBodySchema } from '../validators/repo';
import { logger } from '../utils/logger';

export const getAvailableRepos = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId).select('+accessToken').lean();
  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  const repos = await listUserRepos(user.accessToken);

  // Mark which ones are already connected
  const connected = await Repository.find({ ownerId: userId, isActive: true }).lean();
  const connectedIds = new Set(connected.map((r) => r.githubRepoId));

  res.json({
    data: repos.map((r) => ({
      ...r,
      connected: connectedIds.has(r.id),
    })),
  });
};

export const connectRepo = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const body = connectRepoBodySchema.parse(req.body);

  // Check not already connected
  const existing = await Repository.findOne({
    githubRepoId: body.githubRepoId,
    ownerId: userId,
    isActive: true,
  });
  if (existing) throw new HttpError(409, 'Repository already connected', 'REPO_ALREADY_CONNECTED');

  const user = await User.findById(userId).select('+accessToken').lean();
  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  const webhookSecret = generateWebhookSecret();

  // Create the repo doc first to get its _id for the webhook URL
  const repo = await Repository.create({
    githubRepoId: body.githubRepoId,
    fullName: body.fullName,
    description: body.description,
    isPrivate: body.isPrivate,
    ownerId: userId,
    teamId: body.teamId ?? undefined,
    webhookSecret,
    isActive: true,
  });

  // Register webhook on GitHub
  const webhookUrl = `${process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`}/api/events/webhook/${repo._id}`;

  try {
    const webhookId = await createWebhook(
      user.accessToken,
      body.fullName,
      webhookUrl,
      webhookSecret,
    );
    repo.webhookId = webhookId;
    await repo.save();
  } catch (err) {
    // Clean up repo doc if webhook creation fails
    await Repository.deleteOne({ _id: repo._id });
    logger.error('Failed to create GitHub webhook', err);
    throw new HttpError(502, 'Failed to register GitHub webhook', 'WEBHOOK_CREATE_FAILED');
  }

  // Add to user's connectedRepos
  await User.findByIdAndUpdate(userId, { $addToSet: { connectedRepos: repo._id } });

  // Add to team's repositories if teamId provided
  if (body.teamId) {
    await Team.findByIdAndUpdate(body.teamId, { $addToSet: { repositories: repo._id } });
  }

  res.status(201).json({ data: repo, message: 'Repository connected successfully' });
};

export const disconnectRepo = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const { repoId } = req.params;

  const repo = await Repository.findOne({ _id: repoId, ownerId: userId }).select('+webhookSecret');
  if (!repo) throw new HttpError(404, 'Repository not found', 'REPO_NOT_FOUND');

  const user = await User.findById(userId).select('+accessToken').lean();
  if (!user) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

  // Delete webhook from GitHub
  if (repo.webhookId) {
    await deleteWebhook(user.accessToken, repo.fullName, repo.webhookId);
  }

  repo.isActive = false;
  repo.webhookId = undefined;
  await repo.save();

  await User.findByIdAndUpdate(userId, { $pull: { connectedRepos: repo._id } });

  if (repo.teamId) {
    await Team.findByIdAndUpdate(repo.teamId, { $pull: { repositories: repo._id } });
  }

  res.json({ data: null, message: 'Repository disconnected successfully' });
};

export const getConnectedRepos = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const repos = await Repository.find({ ownerId: userId, isActive: true }).lean();
  res.json({ data: repos });
};
