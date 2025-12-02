import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { connectSlack } from '@/lib/helpers/socialHelpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the clerkId

    if (!code || !state) {
      return NextResponse.redirect(new URL('/connections?error=missing_params', request.url));
    }

    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') || !process.env.NEXT_PUBLIC_APP_URL)
      ? 'https://seagull-amusing-optionally.ngrok-free.app'
      : process.env.NEXT_PUBLIC_APP_URL;
    const redirectUri = `${baseUrl}/api/auth/slack/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await tokenResponse.json();

    if (!data.ok) {
      throw new Error(data.error || 'Slack OAuth failed');
    }

    // Save to database
    await connectDB();

    const user = await User.findOne({ clerkId: state });

    if (!user) {
      throw new Error('User not found');
    }

    // Save to Slack table and update Social table
    await connectSlack(user._id, {
      teamId: data.team.id,
      teamName: data.team.name,
      accessToken: data.access_token,
      botUserId: data.bot_user_id,
      scope: data.scope ? data.scope.split(',') : [],
    });

    return NextResponse.redirect(`${baseUrl}/connections?success=slack`);
  } catch (error) {
    console.error('Error in Slack callback:', error);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') || !process.env.NEXT_PUBLIC_APP_URL)
      ? 'https://seagull-amusing-optionally.ngrok-free.app'
      : process.env.NEXT_PUBLIC_APP_URL;
    return NextResponse.redirect(`${baseUrl}/connections?error=auth_failed`);
  }
}
