import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  playerName: string;
  normalizedName: string;
  bestScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardSchema: Schema = new Schema(
  {
    playerName: { type: String, required: true, trim: true, maxlength: 32 },
    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    bestScore: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

LeaderboardSchema.index({ bestScore: -1, updatedAt: 1 });

const LeaderboardEntry: Model<ILeaderboardEntry> =
  mongoose.models.LeaderboardEntry ||
  mongoose.model<ILeaderboardEntry>(
    'LeaderboardEntry',
    LeaderboardSchema,
    'Leaderboard',
  );

export default LeaderboardEntry;
