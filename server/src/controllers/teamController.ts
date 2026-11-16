import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Team, User, Island } from '../models';
import { HttpError } from '../middleware/errorHandler';
import { createTeamSchema, joinTeamSchema } from '../validators/team';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const body = createTeamSchema.parse(req.body);

  // A user can only be in one team
  const existingUser = await User.findById(userId).lean();
  if (existingUser?.teamId) {
    throw new HttpError(409, 'You are already in a team', 'ALREADY_IN_TEAM');
  }

  const baseSlug = slugify(body.name);
  let slug = baseSlug;
  let attempts = 0;
  while (await Team.exists({ slug })) {
    slug = `${baseSlug}-${++attempts}`;
  }

  const team = await Team.create({
    name: body.name,
    slug,
    description: body.description,
    ownerId: userId,
    members: [userId],
    inviteCode: uuidv4(),
    totalXp: existingUser?.xp ?? 0,
    level: 1,
    coins: 0,
  });

  // Create the team's island
  const island = await Island.create({
    teamId: team._id,
    buildings: [
      {
        id: uuidv4(),
        buildingType: 'haunted_cottage',
        level: 1,
        position: { x: 50, y: 50 },
        purchasedAt: new Date(),
      },
    ],
    level: 1,
    theme: 'halloween',
    lastUpdatedAt: new Date(),
  });

  team.islandId = island._id as typeof team.islandId;
  await team.save();

  await User.findByIdAndUpdate(userId, { teamId: team._id });

  res.status(201).json({ data: team, message: 'Team created successfully' });
};

export const getMyTeam = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId).lean();
  if (!user?.teamId) throw new HttpError(404, 'You are not in a team', 'NOT_IN_TEAM');

  const team = await Team.findById(user.teamId)
    .populate('members', 'username displayName avatarUrl xp level coins streakDays')
    .lean();

  if (!team) throw new HttpError(404, 'Team not found', 'TEAM_NOT_FOUND');
  res.json({ data: team });
};

export const getTeamBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const team = await Team.findOne({ slug })
    .populate('members', 'username displayName avatarUrl xp level')
    .lean();

  if (!team) throw new HttpError(404, 'Team not found', 'TEAM_NOT_FOUND');
  res.json({ data: team });
};

export const joinTeam = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const { inviteCode } = joinTeamSchema.parse(req.body);

  const existingUser = await User.findById(userId).lean();
  if (existingUser?.teamId) {
    throw new HttpError(409, 'You are already in a team', 'ALREADY_IN_TEAM');
  }

  const team = await Team.findOne({ inviteCode });
  if (!team) throw new HttpError(404, 'Invalid invite code', 'INVALID_INVITE_CODE');

  await Promise.all([
    Team.findByIdAndUpdate(team._id, {
      $addToSet: { members: userId },
      $inc: { totalXp: existingUser?.xp ?? 0 },
    }),
    User.findByIdAndUpdate(userId, { teamId: team._id }),
  ]);

  res.json({ data: team, message: 'Joined team successfully' });
};

export const leaveTeam = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId).lean();
  if (!user?.teamId) throw new HttpError(400, 'You are not in a team', 'NOT_IN_TEAM');

  const team = await Team.findById(user.teamId);
  if (!team) throw new HttpError(404, 'Team not found', 'TEAM_NOT_FOUND');

  if (String(team.ownerId) === String(userId)) {
    throw new HttpError(400, 'Team owner cannot leave. Transfer ownership or delete the team first.', 'OWNER_CANNOT_LEAVE');
  }

  await Promise.all([
    Team.findByIdAndUpdate(team._id, {
      $pull: { members: userId },
      $inc: { totalXp: -(user.xp ?? 0) },
    }),
    User.findByIdAndUpdate(userId, { $unset: { teamId: 1 } }),
  ]);

  res.json({ data: null, message: 'Left team successfully' });
};

export const removeMember = async (req: Request, res: Response): Promise<void> => {
  const requesterId = (req.user as Express.User)._id;
  const { memberId } = req.params;

  const user = await User.findById(requesterId).lean();
  if (!user?.teamId) throw new HttpError(400, 'You are not in a team', 'NOT_IN_TEAM');

  const team = await Team.findById(user.teamId);
  if (!team) throw new HttpError(404, 'Team not found', 'TEAM_NOT_FOUND');
  if (String(team.ownerId) !== String(requesterId)) {
    throw new HttpError(403, 'Only the team owner can remove members', 'FORBIDDEN');
  }
  if (String(memberId) === String(requesterId)) {
    throw new HttpError(400, 'Cannot remove yourself', 'CANNOT_REMOVE_SELF');
  }

  const memberUser = await User.findById(memberId).lean();

  await Promise.all([
    Team.findByIdAndUpdate(team._id, {
      $pull: { members: memberId },
      $inc: { totalXp: -(memberUser?.xp ?? 0) },
    }),
    User.findByIdAndUpdate(memberId, { $unset: { teamId: 1 } }),
  ]);

  res.json({ data: null, message: 'Member removed' });
};

export const regenerateInviteCode = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as Express.User)._id;
  const user = await User.findById(userId).lean();
  if (!user?.teamId) throw new HttpError(400, 'You are not in a team', 'NOT_IN_TEAM');

  const team = await Team.findById(user.teamId);
  if (!team) throw new HttpError(404, 'Team not found', 'TEAM_NOT_FOUND');
  if (String(team.ownerId) !== String(userId)) {
    throw new HttpError(403, 'Only the team owner can regenerate the invite code', 'FORBIDDEN');
  }

  team.inviteCode = uuidv4();
  await team.save();

  res.json({ data: { inviteCode: team.inviteCode }, message: 'Invite code regenerated' });
};
