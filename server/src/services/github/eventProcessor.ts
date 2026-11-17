import { GithubEvent, User, Repository } from '../../models';
import type { IRepository } from '../../models';
import type { EventType } from '../../types';
import { logger } from '../../utils/logger';

export interface NormalisedEvent {
  eventType: EventType;
  actorGithubId: string;
  actorUsername: string;
  repoFullName: string;
  ref?: string;
  commitCount?: number;
  prNumber?: number;
  issueNumber?: number;
}

/**
 * Map a raw GitHub webhook (event header + payload) to our EventType enum.
 * Returns null if the event is not one we handle.
 */
export function classifyEvent(
  githubEvent: string,
  payload: Record<string, unknown>,
): EventType | null {
  switch (githubEvent) {
    case 'push':
      return 'push';
    case 'pull_request': {
      const action = payload.action as string;
      const merged = (payload.pull_request as Record<string, unknown>)?.merged;
      if (action === 'opened') return 'pull_request.opened';
      if (action === 'closed' && merged) return 'pull_request.merged';
      if (action === 'closed' && !merged) return 'pull_request.closed';
      return null;
    }
    case 'pull_request_review':
      return (payload.action as string) === 'submitted' ? 'pull_request_review' : null;
    case 'issues':
      if ((payload.action as string) === 'opened') return 'issues.opened';
      if ((payload.action as string) === 'closed') return 'issues.closed';
      return null;
    case 'release':
      return (payload.action as string) === 'published' ? 'release' : null;
    default:
      return null;
  }
}

/**
 * Extract the GitHub actor from the payload.
 */
function extractActor(payload: Record<string, unknown>): { id: string; login: string } | null {
  const sender = payload.sender as Record<string, unknown> | undefined;
  if (!sender) return null;
  return { id: String(sender.id), login: String(sender.login) };
}

/**
 * Process a verified GitHub webhook delivery.
 * Stores the event, deduplicates via delivery id, then fires off reward logic.
 */
export async function processWebhookEvent(
  githubEventHeader: string,
  payload: Record<string, unknown>,
  deliveryId: string,
  repo: IRepository,
): Promise<void> {
  // Idempotency check
  const existing = await GithubEvent.findOne({ githubDeliveryId: deliveryId }).lean();
  if (existing) {
    logger.debug(`Duplicate delivery ${deliveryId} – skipping`);
    return;
  }

  const eventType = classifyEvent(githubEventHeader, payload);
  if (!eventType) {
    logger.debug(`Unhandled event type: ${githubEventHeader} – ignoring`);
    return;
  }

  const actor = extractActor(payload);

  // Look up which CommitCraft user this actor is
  const user = actor
    ? await User.findOne({ githubId: actor.id }).lean()
    : null;

  // Store the event
  const event = await GithubEvent.create({
    repoId: repo._id,
    userId: user?._id,
    githubDeliveryId: deliveryId,
    eventType,
    payload,
    processed: false,
    rewardGranted: false,
  });

  // Update repo last-sync time
  await Repository.findByIdAndUpdate(repo._id, { lastSyncedAt: new Date() });

  if (!user) {
    logger.debug(
      `No matching user for GitHub actor ${actor?.login ?? 'unknown'} – event stored without reward`,
    );
    await GithubEvent.findByIdAndUpdate(event._id, { processed: true });
    return;
  }

  // Dispatch to gamification asynchronously – we already responded 200 to GitHub
  setImmediate(async () => {
    try {
      // Dynamically import to avoid circular deps at startup
      const { grantReward } = await import('../gamification/gamificationService');
      await grantReward(String(user._id), eventType, String(event._id));
      await GithubEvent.findByIdAndUpdate(event._id, { processed: true, rewardGranted: true });
    } catch (err) {
      logger.error(`Error processing event ${event._id}`, err);
      await GithubEvent.findByIdAndUpdate(event._id, {
        processed: true,
        processingError: (err as Error).message,
      });
    }
  });
}
