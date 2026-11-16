import { Router } from 'express';
import passport from 'passport';
import { getMe, logout, authCallback, authFailed } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Kick off GitHub OAuth flow
router.get(
  '/github',
  passport.authenticate('github', { scope: ['read:user', 'user:email', 'repo'] }),
);

// GitHub redirects back here with a code
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api/auth/failed' }),
  authCallback,
);

// OAuth failure landing
router.get('/failed', authFailed);

// Get current authenticated user
router.get('/me', authMiddleware, getMe);

// Logout
router.post('/logout', logout);

export default router;
