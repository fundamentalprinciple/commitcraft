import { Document, model, Schema } from 'mongoose';
import type { QuestTarget, QuestType } from '../types';

export interface IQuest extends Document {
  title: string;
  description: string;
  type: QuestType;
  targetType: QuestTarget;
  targetCount: number;
  xpReward: number;
  coinReward: number;
  expiresAt?: Date;
  aiGenerated: boolean;
  repoContext?: string;
  isActive: boolean;
  createdAt: Date;
}

const QuestSchema = new Schema<IQuest>(
  {
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 300 },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'milestone', 'ai_generated'],
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['commits', 'prs', 'reviews', 'issues', 'streak', 'releases'],
      required: true,
    },
    targetCount: { type: Number, required: true, min: 1 },
    xpReward: { type: Number, required: true, min: 0 },
    coinReward: { type: Number, required: true, min: 0 },
    expiresAt: { type: Date },
    aiGenerated: { type: Boolean, default: false },
    repoContext: { type: String },
    isActive: { type: Boolean, default: true, index: true },
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

export const Quest = model<IQuest>('Quest', QuestSchema);
