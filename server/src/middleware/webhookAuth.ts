import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { Repository } from '../models';
import { HttpError } from './errorHandler';
import { logger } from '../utils/logger';

/**
 * Verifies the GitHub webhook signature (x-hub-signature-256).
 * Must be applied BEFORE express.json() parses the body for this route,
 * so we receive the raw buffer. The webhook router uses express.raw().
 */
export const verifyWebhookSignature = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { repoId } = req.params;
    const signature = req.headers['x-hub-signature-256'] as string | undefined;
    const delivery = req.headers['x-github-delivery'] as string | undefined;

    if (!signature) throw new HttpError(401, 'Missing webhook signature', 'MISSING_SIGNATURE');
    if (!delivery) throw new HttpError(400, 'Missing delivery ID', 'MISSING_DELIVERY');

    const repo = await Repository.findOne({ _id: repoId, isActive: true })
      .select('+webhookSecret')
      .lean();
    if (!repo) throw new HttpError(404, 'Repository not found', 'REPO_NOT_FOUND');

    const rawBody = req.body as Buffer;
    const expected = `sha256=${crypto
      .createHmac('sha256', repo.webhookSecret)
      .update(rawBody)
      .digest('hex')}`;

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      logger.warn(`Invalid webhook signature for repo ${repoId}`);
      throw new HttpError(401, 'Invalid webhook signature', 'INVALID_SIGNATURE');
    }

    // Attach parsed body and delivery id for downstream handlers
    req.body = JSON.parse(rawBody.toString('utf8'));
    res.locals.githubDelivery = delivery;
    res.locals.repo = repo;

    next();
  } catch (err) {
    next(err);
  }
};
