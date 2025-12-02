import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;

    try {
      await connectDB();

      const user = await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        username: username,
        photo: image_url,
      } as any);

      console.log('User created in database:', user);

      return new Response(JSON.stringify({ message: 'User created', user }), {
        status: 201,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;

    try {
      await connectDB();

      const user = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          username: username,
          photo: image_url,
        },
        { new: true }
      );

      console.log('User updated in database:', user);

      return new Response(JSON.stringify({ message: 'User updated', user }), {
        status: 200,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await connectDB();

      const user = await User.findOneAndDelete({ clerkId: id });

      console.log('User deleted from database:', user);

      return new Response(JSON.stringify({ message: 'User deleted', user }), {
        status: 200,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', {
        status: 500,
      });
    }
  }

  return new Response('', { status: 200 });
}
