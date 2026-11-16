import { Document, model, Schema, Types } from 'mongoose';
import type { EventType } from '../types';

export interface IRewardHistory extends Document {
  userId: Types.ObjectId;
  eventType: EventType | 'quest_complete' | 'achievement_unlock' | 'streak_bonus';
  xpGranted: number;
  coinsGranted: number;
  sourceEventId?: Types.ObjectId;
  sourceQuestId?: Types.ObjectId;
  sourceAchievementSlug?: string;
  description: string;
  createdAt: Date;
}

const RewardHistorySchema = new Schema<IRewardHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventType: { type: String, required: true },
    xpGranted: { type: Number, required: true, min: 0 },
    coinsGranted: { type: Number, required: true, min: 0 },
    sourceEventId: { type: Schema.Types.ObjectId, ref: 'GithubEvent' },
    sourceQuestId: { type: Schema.Types.ObjectId, ref: 'Quest' },
    sourceAchievementSlug: { type: String },
    description: { type: String, required: true },
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

export const RewardHistory = model<IRewardHistory>('RewardHistory', RewardHistorySchema);
