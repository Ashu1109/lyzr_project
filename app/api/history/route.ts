import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Build backend URL with user_id
    const backendBaseUrl = "http://13.234.48.54:8000";
    const backendUrl = `${backendBaseUrl}/api/history?user_id=${userId}`;

    const response = await fetch(backendUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend Error:', errorText);
      return new NextResponse(`Backend Error: ${errorText}`, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
