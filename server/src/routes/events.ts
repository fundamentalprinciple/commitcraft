import { Router } from 'express';
import express from 'express';
import { verifyWebhookSignature } from '../middleware/webhookAuth';
import { receiveWebhook } from '../controllers/webhookController';
import { getRecentEvents, getEventsByRepo } from '../controllers/eventController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// ── GitHub webhook receiver (public, signature-verified) ─────
router.post(
  '/webhook/:repoId',
  express.raw({ type: 'application/json' }),
  verifyWebhookSignature,
  receiveWebhook,
);

// ── Event history (authenticated) ────────────────────────────
router.get('/', authMiddleware, getRecentEvents);
router.get('/repo/:repoId', authMiddleware, getEventsByRepo);

export default router;
