import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = process.env.SLACK_CLIENT_ID;
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') || !process.env.NEXT_PUBLIC_APP_URL)
      ? 'https://lyzrproject-two.vercel.app'
      : process.env.NEXT_PUBLIC_APP_URL;
    const redirectUri = `${baseUrl}/api/auth/slack/callback`;

    const scopes = [
      'channels:history',
      'channels:read',
      'chat:write',
      'users:read',
      'users:read.email',
    ];

    const authUrl = `https://slack.com/oauth/v2/authorize?${new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri,
      scope: scopes.join(','),
      state: userId,
    })}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error initiating Slack auth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
