import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id: sessionId } = await params;

    // Validate session ID
    if (!sessionId || sessionId === 'undefined' || sessionId.length < 10) {
      console.error('Invalid session ID:', sessionId);
      return new NextResponse('Invalid session ID', { status: 400 });
    }

    console.log('Fetching session:', sessionId);

    const backendUrl = `http://localhost:8000/api/history/${sessionId}`;

    const response = await fetch(backendUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend Error:', errorText);
      return new NextResponse(`Backend Error: ${errorText}`, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching session:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
