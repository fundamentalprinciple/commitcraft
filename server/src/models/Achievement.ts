import { Document, model, Schema } from 'mongoose';

export interface IAchievement extends Document {
  slug: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  condition: {
    type: 'commits' | 'prs_merged' | 'issues_closed' | 'reviews' | 'streak' | 'quests' | 'level' | 'releases';
    threshold: number;
  };
  xpReward: number;
  createdAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'legendary'],
      default: 'common',
    },
    condition: {
      type: {
        type: String,
        enum: ['commits', 'prs_merged', 'issues_closed', 'reviews', 'streak', 'quests', 'level', 'releases'],
        required: true,
      },
      threshold: { type: Number, required: true },
    },
    xpReward: { type: Number, default: 50 },
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

export const Achievement = model<IAchievement>('Achievement', AchievementSchema);
