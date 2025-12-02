import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Social from '@/lib/models/Social';
import GoogleDrive from '@/lib/models/GoogleDrive';
import Slack from '@/lib/models/Slack';
import Github from '@/lib/models/Github';
import Gmail from '@/lib/models/Gmail';
import GoogleChat from '@/lib/models/GoogleChat';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { service } = await req.json();

    if (!service) {
      return NextResponse.json({ error: 'Service name required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the social connection record
    const social = await Social.findOne({ userId: user._id });

    if (!social) {
      return NextResponse.json({ error: 'No connections found' }, { status: 404 });
    }

    // Map service names to models and field names
    const serviceMap: Record<string, { model: any; field: string; serviceName: string }> = {
      googleDrive: { model: GoogleDrive, field: 'googleDriveId', serviceName: 'Google Drive' },
      slack: { model: Slack, field: 'slackId', serviceName: 'Slack' },
      github: { model: Github, field: 'githubId', serviceName: 'GitHub' },
      gmail: { model: Gmail, field: 'gmailId', serviceName: 'Gmail' },
      googleChat: { model: GoogleChat, field: 'googleChatId', serviceName: 'Google Chat' },
    };

    const serviceInfo = serviceMap[service];

    if (!serviceInfo) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    const { model, field, serviceName } = serviceInfo;

    // Get the service document ID from Social table
    const serviceDocId = social[field as keyof typeof social];

    if (!serviceDocId) {
      return NextResponse.json({
        error: `${serviceName} is not connected`,
        success: false
      }, { status: 400 });
    }

    // Delete the service document
    await model.findByIdAndDelete(serviceDocId);

    // Remove reference from Social table
    await Social.findByIdAndUpdate(social._id, {
      $set: { [field]: null }
    });

    console.log(`✅ Disconnected ${serviceName} for user ${user.email}`);

    return NextResponse.json({
      success: true,
      message: `${serviceName} disconnected successfully`
    });

  } catch (error) {
    console.error('Error disconnecting service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
