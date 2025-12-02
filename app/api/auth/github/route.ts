import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/github/callback`;

    const scopes = ['repo', 'read:user', 'user:email'];

    const authUrl = `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: clientId!,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state: userId,
    })}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error initiating GitHub auth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
