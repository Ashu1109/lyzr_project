import mongoose from 'mongoose';
import User from '@/lib/models/User';
import Social from '@/lib/models/Social';
import GoogleDrive from '@/lib/models/GoogleDrive';
import Slack from '@/lib/models/Slack';
import GitHub from '@/lib/models/GitHub';
import Gmail from '@/lib/models/Gmail';

/**
 * Get or create a Social document for a user
 */
export async function getOrCreateSocial(userId: mongoose.Types.ObjectId) {
  let social = await Social.findOne({ userId });

  if (!social) {
    social = await Social.create({
      userId,
      connectedServices: [],
    });
  }

  return social;
}

/**
 * Get user's connection status for all services
 */
export async function getUserConnections(userId: mongoose.Types.ObjectId) {
  const social = await Social.findOne({ userId })
    .populate('googleDriveId', 'connected connectedAt email')
    .populate('slackId', 'connected connectedAt teamName')
    .populate('githubId', 'connected connectedAt username')
    .populate('gmailId', 'connected connectedAt email');


  return {
    googleDrive: social?.googleDriveId
      ? {
          connected: (social.googleDriveId as any).connected,
          connectedAt: (social.googleDriveId as any).connectedAt,
          email: (social.googleDriveId as any).email,
        }
      : { connected: false },
    slack: social?.slackId
      ? {
          connected: (social.slackId as any).connected,
          connectedAt: (social.slackId as any).connectedAt,
          teamName: (social.slackId as any).teamName,
        }
      : { connected: false },
    github: social?.githubId
      ? {
          connected: (social.githubId as any).connected,
          connectedAt: (social.githubId as any).connectedAt,
          username: (social.githubId as any).username,
        }
      : { connected: false },
    gmail: social?.gmailId
      ? {
          connected: (social.gmailId as any).connected,
          connectedAt: (social.gmailId as any).connectedAt,
          email: (social.gmailId as any).email,
        }
      : { connected: false },
  };
}

/**
 * Connect Google Drive for a user
 */
export async function connectGoogleDrive(
  userId: mongoose.Types.ObjectId,
  data: {
    email: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope: string[];
  }
) {
  // Check if already exists
  let googleDrive = await GoogleDrive.findOne({ userId });

  if (googleDrive) {
    // Update existing
    googleDrive.email = data.email;
    googleDrive.accessToken = data.accessToken;
    googleDrive.refreshToken = data.refreshToken;
    googleDrive.expiresAt = data.expiresAt;
    googleDrive.scope = data.scope;
    googleDrive.connected = true;
    googleDrive.connectedAt = new Date();
    await googleDrive.save();
  } else {
    // Create new
    googleDrive = await GoogleDrive.create({
      userId,
      ...data,
      connected: true,
      connectedAt: new Date(),
    });
  }

  // Update social
  const social = await getOrCreateSocial(userId);
  social.googleDriveId = googleDrive._id as mongoose.Types.ObjectId;

  if (!social.connectedServices.includes('googleDrive')) {
    social.connectedServices.push('googleDrive');
  }

  await social.save();

  return googleDrive;
}

/**
 * Connect Slack for a user
 */
export async function connectSlack(
  userId: mongoose.Types.ObjectId,
  data: {
    teamId: string;
    teamName?: string;
    accessToken: string;
    botUserId?: string;
    scope: string[];
  }
) {
  // Check if already exists
  let slack = await Slack.findOne({ userId });

  if (slack) {
    // Update existing
    slack.teamId = data.teamId;
    slack.teamName = data.teamName;
    slack.accessToken = data.accessToken;
    slack.botUserId = data.botUserId;
    slack.scope = data.scope;
    slack.connected = true;
    slack.connectedAt = new Date();
    await slack.save();
  } else {
    // Create new
    slack = await Slack.create({
      userId,
      ...data,
      connected: true,
      connectedAt: new Date(),
    });
  }

  // Update social
  const social = await getOrCreateSocial(userId);
  social.slackId = slack._id as mongoose.Types.ObjectId;

  if (!social.connectedServices.includes('slack')) {
    social.connectedServices.push('slack');
  }

  await social.save();

  return slack;
}

/**
 * Connect GitHub for a user
 */
export async function connectGitHub(
  userId: mongoose.Types.ObjectId,
  data: {
    githubId: string;
    username: string;
    email?: string;
    accessToken: string;
    scope: string[];
  }
) {
  // Check if already exists
  let github = await GitHub.findOne({ userId });

  if (github) {
    // Update existing
    github.githubId = data.githubId;
    github.username = data.username;
    github.email = data.email;
    github.accessToken = data.accessToken;
    github.scope = data.scope;
    github.connected = true;
    github.connectedAt = new Date();
    await github.save();
  } else {
    // Create new
    github = await GitHub.create({
      userId,
      ...data,
      connected: true,
      connectedAt: new Date(),
    });
  }

  // Update social
  const social = await getOrCreateSocial(userId);
  social.githubId = github._id as mongoose.Types.ObjectId;

  if (!social.connectedServices.includes('github')) {
    social.connectedServices.push('github');
  }

  await social.save();

  return github;
}

/**
 * Connect Gmail for a user
 */
export async function connectGmail(
  userId: mongoose.Types.ObjectId,
  data: {
    email: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    scope: string[];
  }
) {
  // Check if already exists
  let gmail = await Gmail.findOne({ userId });

  if (gmail) {
    // Update existing
    gmail.email = data.email;
    gmail.accessToken = data.accessToken;
    gmail.refreshToken = data.refreshToken;
    gmail.expiresAt = data.expiresAt;
    gmail.scope = data.scope;
    gmail.connected = true;
    gmail.connectedAt = new Date();
    await gmail.save();
  } else {
    // Create new
    gmail = await Gmail.create({
      userId,
      ...data,
      connected: true,
      connectedAt: new Date(),
    });
  }

  // Update social
  const social = await getOrCreateSocial(userId);
  social.gmailId = gmail._id as mongoose.Types.ObjectId;

  if (!social.connectedServices.includes('gmail')) {
    social.connectedServices.push('gmail');
  }

  await social.save();

  return gmail;
}


/**
 * Get user's tokens for a specific service
 */
export async function getUserTokens(userId: mongoose.Types.ObjectId) {
  const social = await Social.findOne({ userId });

  if (!social) {
    return {
      googleDrive: null,
      slack: null,
      github: null,
      gmail: null,
    };
  }

  const [googleDrive, slack, github, gmail] = await Promise.all([
    social.googleDriveId
      ? GoogleDrive.findById(social.googleDriveId).select('+accessToken +refreshToken')
      : null,
    social.slackId
      ? Slack.findById(social.slackId).select('+accessToken')
      : null,
    social.githubId
      ? GitHub.findById(social.githubId).select('+accessToken')
      : null,
    social.gmailId
      ? Gmail.findById(social.gmailId).select('+accessToken +refreshToken')
      : null,
  ]);

  return {
    googleDrive: googleDrive
      ? {
          accessToken: googleDrive.accessToken,
          refreshToken: googleDrive.refreshToken,
          expiresAt: googleDrive.expiresAt,
        }
      : null,
    slack: slack
      ? {
          accessToken: slack.accessToken,
        }
      : null,
    github: github
      ? {
          accessToken: github.accessToken,
        }
      : null,
    gmail: gmail
      ? {
          accessToken: gmail.accessToken,
          refreshToken: gmail.refreshToken,
          expiresAt: gmail.expiresAt,
        }
      : null,
  };
}

/**
 * Disconnect a service for a user
 */
export async function disconnectService(
  userId: mongoose.Types.ObjectId,
  service: 'googleDrive' | 'slack' | 'github' | 'gmail'
) {
  const social = await Social.findOne({ userId });

  if (!social) {
    return;
  }

  if (service === 'googleDrive' && social.googleDriveId) {
    await GoogleDrive.findByIdAndDelete(social.googleDriveId);
    social.googleDriveId = undefined;
    social.connectedServices = social.connectedServices.filter((s) => s !== 'googleDrive');
  } else if (service === 'slack' && social.slackId) {
    await Slack.findByIdAndDelete(social.slackId);
    social.slackId = undefined;
    social.connectedServices = social.connectedServices.filter((s) => s !== 'slack');
  } else if (service === 'github' && social.githubId) {
    await GitHub.findByIdAndDelete(social.githubId);
    social.githubId = undefined;
    social.connectedServices = social.connectedServices.filter((s) => s !== 'github');
  } else if (service === 'gmail' && social.gmailId) {
    await Gmail.findByIdAndDelete(social.gmailId);
    social.gmailId = undefined;
    social.connectedServices = social.connectedServices.filter((s) => s !== 'gmail');
  }

  await social.save();
}
