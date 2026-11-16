import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string> = {};
    (err as ZodError).issues.forEach((e) => {
      details[e.path.join('.')] = e.message;
    });
    res.status(400).json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details });
    return;
  }

  // Known HTTP errors
  const httpError = err as Error & { status?: number; code?: string };
  const status = httpError.status ?? 500;
  const code = httpError.code ?? 'INTERNAL_SERVER_ERROR';

  if (status >= 500) {
    logger.error('Unhandled server error', err);
  }

  res.status(status).json({
    error: status >= 500 ? 'An unexpected error occurred' : err.message,
    code,
  });
};

// Factory for typed HTTP errors
export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code ?? `HTTP_${status}`;
  }
}
