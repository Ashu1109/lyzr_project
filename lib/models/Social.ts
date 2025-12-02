import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISocial extends Document {
  userId: mongoose.Types.ObjectId;
  googleDriveId?: mongoose.Types.ObjectId;
  slackId?: mongoose.Types.ObjectId;
  githubId?: mongoose.Types.ObjectId;
  gmailId?: mongoose.Types.ObjectId;
  googleChatId?: mongoose.Types.ObjectId;
  connectedServices: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SocialSchema = new Schema<ISocial>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    googleDriveId: {
      type: Schema.Types.ObjectId,
      ref: 'GoogleDrive',
    },
    slackId: {
      type: Schema.Types.ObjectId,
      ref: 'Slack',
    },
    githubId: {
      type: Schema.Types.ObjectId,
      ref: 'GitHub',
    },
    gmailId: {
      type: Schema.Types.ObjectId,
      ref: 'Gmail',
    },
    googleChatId: {
      type: Schema.Types.ObjectId,
      ref: 'GoogleChat',
    },
    connectedServices: [{
      type: String,
      enum: ['googleDrive', 'slack', 'github', 'gmail', 'googleChat'],
    }],
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
SocialSchema.index({ userId: 1 });

const Social: Model<ISocial> =
  mongoose.models.Social || mongoose.model<ISocial>('Social', SocialSchema);

export default Social;
