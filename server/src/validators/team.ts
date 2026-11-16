import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(300).optional(),
});

export const joinTeamSchema = z.object({
  inviteCode: z.string().uuid('Invalid invite code'),
});

export type CreateTeamBody = z.infer<typeof createTeamSchema>;
export type JoinTeamBody = z.infer<typeof joinTeamSchema>;
