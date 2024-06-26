import { APIEvent } from '@solidjs/start/server';

import { getDb, auth } from '~/lib/server/db';
import { AddProfileToContact, PrivateProfile } from '~/types/profile';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as AddProfileToContact;

  if (request.id === request.auth.id)
    return new Response('Cannot add self', { status: 400 });

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<PrivateProfile>('profiles');

  const target = await collection.findOne({
    id: request.id,
  });

  if (target === null)
    return new Response('Profile not found', { status: 404 });

  const result = await collection.findOneAndUpdate(
    {
      id: request.auth.id,
      $nor: [{ contactIds: [request.id] }],
    },
    {
      $push: {
        contactIds: request.id,
      },
    },
  );

  if (result === null)
    return new Response('Profile not added', { status: 404 });

  return await collection.findOne({
    id: request.id,
  });
};
