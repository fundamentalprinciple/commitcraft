import { z } from 'zod';

export const connectRepoSchema = z.object({
  githubRepoId: z.number().int().positive(),
  fullName: z.string().min(3).regex(/^[\w.-]+\/[\w.-]+$/, 'Must be in owner/repo format'),
  description: z.string().max(500).optional(),
  isPrivate: z.boolean().default(false),
});

export const teamIdSchema = z.object({
  teamId: z.string().length(24).optional(),
});

export const connectRepoBodySchema = connectRepoSchema.merge(teamIdSchema);

export type ConnectRepoBody = z.infer<typeof connectRepoBodySchema>;
