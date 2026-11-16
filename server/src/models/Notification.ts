import { Document, model, Schema, Types } from 'mongoose';

export type NotificationType =
  | 'reward_earned'
  | 'quest_completed'
  | 'achievement_unlocked'
  | 'island_updated'
  | 'team_activity'
  | 'invitation_received'
  | 'level_up';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false, index: true },
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

export const Notification = model<INotification>('Notification', NotificationSchema);
