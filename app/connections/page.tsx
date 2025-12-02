import { Github, Mail, Database, Check, Inbox, ArrowRight, Search } from 'lucide-react';
import { MasonryGrid } from '@/components/MasonryGrid';
import { cn } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import User from '@/lib/models/User';
import { getUserConnections } from '@/lib/helpers/socialHelpers';
import connectDB from '@/lib/mongodb';
import { ClientConnectionsPage } from './ClientConnectionsPage';

interface Connection {
  connected: boolean;
  connectedAt?: string;
}

interface UserConnections {
  googleDrive?: Connection;
  slack?: Connection;
  github?: Connection;
  gmail?: Connection;
}

export default async function ConnectionsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  await connectDB();

  const user = await User.findOne({ clerkUserId: userId });

  if (!user) {
    redirect('/sign-in');
  }

  const connections = await getUserConnections(user._id);

  return <ClientConnectionsPage initialConnections={connections} />;
}
