import { APIEvent } from '@solidjs/start/server';
import { sha256 } from 'hash-wasm';

import { getDb, auth } from '~/lib/server/db';
import { Room, CreateRoom } from '~/types/room';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as CreateRoom;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<Room>('rooms');

  const room: Room = {
    ...request,
    id: await sha256(performance.now().toString()),
    avatar: '',
    members: [
      {
        id: request.auth.id,
        power: 0,
      },
      ...request.otherMemberIds.map((id) => ({
        id,
        power: 50,
      })),
    ],
    messageIds: [],
  };

  const result = await collection.insertOne(room);

  return room;
};
