import { Document, model, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
  accessToken: string;
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActivityDate?: Date;
  achievements: Types.ObjectId[];
  connectedRepos: Types.ObjectId[];
  teamId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    email: { type: String },
    accessToken: { type: String, required: true, select: false },
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    coins: { type: Number, default: 0, min: 0 },
    streakDays: { type: Number, default: 0, min: 0 },
    lastActivityDate: { type: Date },
    achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
    connectedRepos: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>; delete r.__v;
        delete r.accessToken;
        return ret;
      },
    },
  },
);

export const User = model<IUser>('User', UserSchema);
