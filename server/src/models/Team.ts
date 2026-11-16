import { Document, model, Schema, Types } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  slug: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: Types.ObjectId[];
  islandId?: Types.ObjectId;
  totalXp: number;
  level: number;
  coins: number;
  inviteCode: string;
  repositories: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    islandId: { type: Schema.Types.ObjectId, ref: 'Island' },
    totalXp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    coins: { type: Number, default: 0, min: 0 },
    inviteCode: { type: String, required: true, unique: true, index: true },
    repositories: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>; delete r.__v;
        return ret;
      },
    },
  },
);

export const Team = model<ITeam>('Team', TeamSchema);
