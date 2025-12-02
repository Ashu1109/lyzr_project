import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISlack extends Document {
  userId: mongoose.Types.ObjectId;
  teamId: string;
  teamName?: string;
  accessToken: string;
  botUserId?: string;
  scope: string[];
  connected: boolean;
  connectedAt: Date;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SlackSchema = new Schema<ISlack>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamId: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't return by default for security
    },
    botUserId: {
      type: String,
    },
    scope: [{
      type: String,
    }],
    connected: {
      type: Boolean,
      default: true,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    lastSyncAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
SlackSchema.index({ userId: 1 });
SlackSchema.index({ teamId: 1 });

const Slack: Model<ISlack> =
  mongoose.models.Slack || mongoose.model<ISlack>('Slack', SlackSchema);

export default Slack;
