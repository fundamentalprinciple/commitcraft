import { Document, model, Schema, Types } from 'mongoose';
import type { BuildingType } from '../types';

export interface IBuilding {
  id: string;
  buildingType: BuildingType;
  level: number;
  position: { x: number; y: number };
  purchasedAt: Date;
}

export interface IIsland extends Document {
  teamId: Types.ObjectId;
  buildings: IBuilding[];
  level: number;
  theme: string;
  lastUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BuildingSchema = new Schema<IBuilding>(
  {
    id: { type: String, required: true },
    buildingType: { type: String, required: true },
    level: { type: Number, default: 1, min: 1, max: 3 },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    purchasedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const IslandSchema = new Schema<IIsland>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, unique: true, index: true },
    buildings: [BuildingSchema],
    level: { type: Number, default: 1, min: 1 },
    theme: { type: String, default: 'halloween' },
    lastUpdatedAt: { type: Date, default: Date.now },
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

export const Island = model<IIsland>('Island', IslandSchema);
