import 'express-async-errors';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { connectDB } from './config/db';
import { configurePassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import repoRoutes from './routes/repos';
import teamRoutes from './routes/teams';
import eventRoutes from './routes/events';
import gamificationRoutes from './routes/gamification';

const app = express();
const httpServer = createServer(app);

// ── Socket.IO ────────────────────────────────────────────────
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId as string | undefined;
  if (userId) {
    socket.join(`user:${userId}`);
    logger.debug(`Socket connected: user ${userId}`);
  }

  socket.on('join:team', (teamId: string) => {
    socket.join(`team:${teamId}`);
  });

  socket.on('disconnect', () => {
    logger.debug(`Socket disconnected: ${socket.id}`);
  });
});

// ── Core middleware ──────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests', code: 'RATE_LIMITED' },
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests', code: 'RATE_LIMITED' },
});

// ── Sessions ─────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/commitcraft',
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

// ── Passport ─────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// ── Routes ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter);
app.use('/api/events', webhookLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gamification', gamificationRoutes);

// ── Error handler (must be last) ─────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '5000', 10);

const start = async () => {
  await connectDB();

  // Seed static data
  const { seedDefaultQuests } = await import('./services/quest/questService');
  const { seedAchievements } = await import('./services/achievement/achievementService');
  await Promise.all([seedDefaultQuests(), seedAchievements()]);

  httpServer.listen(PORT, () => {
    logger.info(`CommitCraft server running on port ${PORT}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});

export default app;
