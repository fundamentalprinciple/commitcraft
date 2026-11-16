import { NextFunction, Request, Response } from 'express';
import { HttpError } from './errorHandler';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.isAuthenticated() || !req.user) {
    throw new HttpError(401, 'Authentication required', 'UNAUTHORIZED');
  }
  next();
};
