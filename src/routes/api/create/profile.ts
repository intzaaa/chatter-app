import { APIEvent } from '@solidjs/start/server';
import { sha256 } from 'hash-wasm';

import { getDb } from '~/lib/server/db';
import { PrivateProfile, CreateProfile } from '~/types/profile';

export async function POST(event: APIEvent) {
  const request = (await event.request.json()) as CreateProfile;

  const db = await getDb();

  const collection = db.collection<PrivateProfile>('profiles');

  if (await collection.findOne({ username: request.username }))
    return new Response('Username already exists', { status: 409 });

  const profile: PrivateProfile = {
    ...request,
    id: await sha256(performance.now().toString()),
    password: await sha256(request.password),
    gender: 'Unknown',
    status: '',
    avatar: '',
    contactIds: [],
  };

  const result = await collection.insertOne(profile);

  return profile;
}
