import { Request, Response } from 'express';
import { User } from '../models';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById((req.user as Express.User)._id).lean();
  res.json({ data: user });
};

export const logout = (req: Request, res: Response): void => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed', code: 'LOGOUT_FAILED' });
      return;
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ data: null, message: 'Logged out successfully' });
    });
  });
};

export const authCallback = (req: Request, res: Response): void => {
  const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
  res.redirect(`${clientUrl}/dashboard`);
};

export const authFailed = (_req: Request, res: Response): void => {
  const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
  res.redirect(`${clientUrl}/login?error=auth_failed`);
};
