import { APIEvent } from '@solidjs/start/server';

import { getDb, auth } from '~/lib/server/db';
import { PrivateProfile, RemoveProfile } from '~/types/profile';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as RemoveProfile;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<PrivateProfile>('profiles');

  const profile = await collection.findOne({
    id: request.id,
  });

  if (profile === null)
    return new Response('Profile not found', { status: 404 });

  const result = await collection.deleteOne({ id: request.id });

  return {
    id: request.id,
  };
};
