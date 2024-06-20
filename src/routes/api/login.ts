import { APIEvent } from '@solidjs/start/server';
import { sha256 } from 'hash-wasm';

import { getDb } from '~/lib/server/db';
import { Login } from '~/types/login';
import { PrivateProfile } from '~/types/profile';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as Login;

  const db = await getDb();

  const collection = db.collection<PrivateProfile>('profiles');

  const profile = await collection.findOne({
    username: request.username,
  });

  if (!profile) return new Response('Profile not found', { status: 404 });

  if (profile.password !== (await sha256(request.password))) {
    return new Response('Unauthorized', { status: 401 });
  } else {
    return profile;
  }
};
