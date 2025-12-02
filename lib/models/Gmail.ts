import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGmail extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scope: string[];
  connected: boolean;
  connectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GmailSchema = new Schema<IGmail>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    expiresAt: Date,
    scope: [String],
    connected: {
      type: Boolean,
      default: false,
    },
    connectedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Gmail: Model<IGmail> =
  mongoose.models.Gmail || mongoose.model<IGmail>('Gmail', GmailSchema);

export default Gmail;
