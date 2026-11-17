import { Router } from 'express';
import {
  getGamificationStats,
  getRewardHistory,
  getQuests,
  claimQuest,
  getAchievements,
} from '../controllers/gamificationController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getGamificationStats);
router.get('/history', getRewardHistory);
router.get('/quests', getQuests);
router.post('/quests/:userQuestId/claim', claimQuest);
router.get('/achievements', getAchievements);

export default router;
