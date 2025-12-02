import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { connectGitHub } from '@/lib/helpers/socialHelpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the clerkId

    if (!code || !state) {
      return NextResponse.redirect(new URL('/connections?error=missing_params', request.url));
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await tokenResponse.json();

    if (data.error) {
      throw new Error(data.error_description || 'GitHub OAuth failed');
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: 'application/json',
      },
    });

    const githubUser = await userResponse.json();

    // Save to database
    await connectDB();

    const user = await User.findOne({ clerkId: state });

    if (!user) {
      throw new Error('User not found');
    }

    // Save to GitHub table and update Social table
    await connectGitHub(user._id, {
      githubId: githubUser.id.toString(),
      username: githubUser.login,
      email: githubUser.email,
      accessToken: data.access_token,
      scope: data.scope ? data.scope.split(',') : [],
    });

    return NextResponse.redirect(new URL('/connections?success=github', request.url));
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    return NextResponse.redirect(new URL('/connections?error=auth_failed', request.url));
  }
}
