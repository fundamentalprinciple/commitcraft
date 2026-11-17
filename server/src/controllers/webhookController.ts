import { Request, Response } from 'express';
import { processWebhookEvent } from '../services/github/eventProcessor';
import type { IRepository } from '../models';
import { logger } from '../utils/logger';

export const receiveWebhook = (req: Request, res: Response): void => {
  // Respond immediately – GitHub expects < 10 s
  res.status(200).json({ received: true });

  const githubEvent = req.headers['x-github-event'] as string;
  const deliveryId = res.locals.githubDelivery as string;
  const repo = res.locals.repo as IRepository;
  const payload = req.body as Record<string, unknown>;

  logger.debug(`Webhook: ${githubEvent} (${deliveryId}) for repo ${repo.fullName}`);

  processWebhookEvent(githubEvent, payload, deliveryId, repo).catch((err) => {
    logger.error(`Unhandled error processing delivery ${deliveryId}`, err);
  });
};
