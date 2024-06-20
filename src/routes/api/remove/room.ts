import { APIEvent } from '@solidjs/start/server';

import { getDb, auth } from '~/lib/server/db';
import { Room, RemoveRoom } from '~/types/room';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as RemoveRoom;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<Room>('rooms');

  const room = await collection.findOne({
    id: request.id,
  });

  if (room === null) return new Response('Room not found', { status: 404 });

  const result = await collection.deleteOne({ id: request.id });

  return {
    id: request.id,
  };
};
