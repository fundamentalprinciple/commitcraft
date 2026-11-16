import { Router } from 'express';
import {
  createTeam,
  getMyTeam,
  getTeamBySlug,
  joinTeam,
  leaveTeam,
  removeMember,
  regenerateInviteCode,
} from '../controllers/teamController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', createTeam);
router.get('/me', getMyTeam);
router.get('/:slug', getTeamBySlug);
router.post('/join', joinTeam);
router.post('/leave', leaveTeam);
router.delete('/members/:memberId', removeMember);
router.post('/invite/regenerate', regenerateInviteCode);

export default router;
