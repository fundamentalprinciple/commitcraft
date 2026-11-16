import { Document, model, Schema, Types } from 'mongoose';

export interface IRepository extends Document {
  githubRepoId: number;
  fullName: string;
  description?: string;
  isPrivate: boolean;
  ownerId: Types.ObjectId;
  teamId?: Types.ObjectId;
  webhookId?: number;
  webhookSecret: string;
  isActive: boolean;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RepositorySchema = new Schema<IRepository>(
  {
    githubRepoId: { type: Number, required: true, index: true },
    fullName: { type: String, required: true },
    description: { type: String },
    isPrivate: { type: Boolean, default: false },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', index: true },
    webhookId: { type: Number },
    webhookSecret: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
    lastSyncedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>; delete r.__v;
        delete r.webhookSecret;
        return ret;
      },
    },
  },
);

export const Repository = model<IRepository>('Repository', RepositorySchema);
