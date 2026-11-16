import { Router } from 'express';
import { getProfile, getStats, getActivity, getPublicProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, getProfile);
router.get('/me/stats', authMiddleware, getStats);
router.get('/me/activity', authMiddleware, getActivity);
router.get('/:username', getPublicProfile);

export default router;
