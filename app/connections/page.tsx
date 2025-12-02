import { Github, Mail, Database, Check, Inbox, ArrowRight, Search } from 'lucide-react';
import { MasonryGrid } from '@/components/MasonryGrid';
import { cn } from '@/lib/utils';
import { auth, currentUser } from '@clerk/nextjs/server';
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

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    // User doesn't exist in database yet, create them
    const clerkUser = await currentUser();
    if (clerkUser) {
      user = await User.create({
        clerkId: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        username: clerkUser.username || '',
        photo: clerkUser.imageUrl || '',
      });
    } else {
      redirect('/sign-in');
    }
  }

  const connections = await getUserConnections(user._id);

  return <ClientConnectionsPage initialConnections={connections} />;
}
