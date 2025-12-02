import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGitHub extends Document {
  userId: mongoose.Types.ObjectId;
  githubId: string;
  username: string;
  email?: string;
  accessToken: string;
  scope: string[];
  connected: boolean;
  connectedAt: Date;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GitHubSchema = new Schema<IGitHub>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    githubId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't return by default for security
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
GitHubSchema.index({ userId: 1 });
GitHubSchema.index({ githubId: 1 });
GitHubSchema.index({ username: 1 });

const GitHub: Model<IGitHub> =
  mongoose.models.GitHub || mongoose.model<IGitHub>('GitHub', GitHubSchema);

export default GitHub;
