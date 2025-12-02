import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGoogleDrive extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope: string[];
  connected: boolean;
  connectedAt: Date;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleDriveSchema = new Schema<IGoogleDrive>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't return by default for security
    },
    refreshToken: {
      type: String,
      select: false,
    },
    expiresAt: {
      type: Date,
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
GoogleDriveSchema.index({ userId: 1 });
GoogleDriveSchema.index({ email: 1 });

const GoogleDrive: Model<IGoogleDrive> =
  mongoose.models.GoogleDrive || mongoose.model<IGoogleDrive>('GoogleDrive', GoogleDriveSchema);

export default GoogleDrive;
