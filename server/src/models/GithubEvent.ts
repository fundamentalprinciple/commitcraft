import { Document, model, Schema, Types } from 'mongoose';
import type { EventType } from '../types';

export interface IGithubEvent extends Document {
  repoId: Types.ObjectId;
  userId?: Types.ObjectId;
  githubDeliveryId: string;
  eventType: EventType;
  payload: Record<string, unknown>;
  processed: boolean;
  rewardGranted: boolean;
  processingError?: string;
  createdAt: Date;
}

const GithubEventSchema = new Schema<IGithubEvent>(
  {
    repoId: { type: Schema.Types.ObjectId, ref: 'Repository', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    githubDeliveryId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    processed: { type: Boolean, default: false, index: true },
    rewardGranted: { type: Boolean, default: false },
    processingError: { type: String },
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

export const GithubEvent = model<IGithubEvent>('GithubEvent', GithubEventSchema);
