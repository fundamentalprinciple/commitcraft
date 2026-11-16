import { Router } from 'express';
import {
  getAvailableRepos,
  connectRepo,
  disconnectRepo,
  getConnectedRepos,
} from '../controllers/repoController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/available', getAvailableRepos);
router.get('/', getConnectedRepos);
router.post('/connect', connectRepo);
router.delete('/:repoId', disconnectRepo);

export default router;
