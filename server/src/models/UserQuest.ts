import { Document, model, Schema, Types } from 'mongoose';

export interface IUserQuest extends Document {
  userId: Types.ObjectId;
  questId: Types.ObjectId;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserQuestSchema = new Schema<IUserQuest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questId: { type: Schema.Types.ObjectId, ref: 'Quest', required: true },
    progress: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    claimedAt: { type: Date },
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

// Prevent duplicate user-quest assignments
UserQuestSchema.index({ userId: 1, questId: 1 }, { unique: true });

export const UserQuest = model<IUserQuest>('UserQuest', UserQuestSchema);
