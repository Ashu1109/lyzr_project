import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { connectGoogleChat } from '@/lib/helpers/socialHelpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the clerkId

    if (!code || !state) {
      return NextResponse.redirect(new URL('/connections?error=missing_params', process.env.NEXT_PUBLIC_APP_URL));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/googleChat/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user email from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    // Save to database
    await connectDB();

    const user = await User.findOne({ clerkId: state });

    if (!user) {
      throw new Error('User not found');
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    // Save to GoogleChat table and update Social table
    await connectGoogleChat(user._id, {
      email: userInfo.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      scope: tokens.scope ? tokens.scope.split(' ') : [],
    });

    return NextResponse.redirect(new URL('/connections?success=googleChat', process.env.NEXT_PUBLIC_APP_URL));
  } catch (error) {
    console.error('Error in Google Chat callback:', error);
    return NextResponse.redirect(new URL('/connections?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL));
  }
}
