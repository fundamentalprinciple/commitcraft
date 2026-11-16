import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { User } from '../models';
import { logger } from '../utils/logger';

export const configurePassport = (): void => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID ?? '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
        callbackURL: process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:5000/api/auth/github/callback',
        scope: ['read:user', 'user:email', 'repo'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
      ) => {
        try {
          const avatarUrl =
            (profile.photos && profile.photos[0]?.value) ??
            `https://avatars.githubusercontent.com/u/${profile.id}`;

          const email =
            (profile.emails && profile.emails[0]?.value) ?? undefined;

          const user = await User.findOneAndUpdate(
            { githubId: profile.id },
            {
              $set: {
                username: profile.username ?? profile.id,
                displayName: profile.displayName ?? profile.username ?? profile.id,
                avatarUrl,
                email,
                accessToken: _accessToken,
              },
              $setOnInsert: {
                githubId: profile.id,
                xp: 0,
                level: 1,
                coins: 0,
                streakDays: 0,
              },
            },
            { upsert: true, new: true, runValidators: true },
          );

          return done(null, user as unknown as Express.User);
        } catch (error) {
          logger.error('Passport GitHub strategy error', error);
          return done(error as Error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, String((user as Express.User)._id));
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id).lean();
      if (!user) return done(null, false);
      done(null, { ...user, _id: String(user._id) } as unknown as Express.User);
    } catch (error) {
      done(error);
    }
  });
};
