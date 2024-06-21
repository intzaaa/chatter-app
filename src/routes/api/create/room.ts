import { APIEvent } from '@solidjs/start/server';
import { sha256 } from 'hash-wasm';
import { uniq, uniqBy, uniqWith } from 'ramda';

import { getDb, auth } from '~/lib/server/db';
import { Room, CreateRoom } from '~/types/room';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as CreateRoom;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<Room>('rooms');

  const room: Room = {
    id: await sha256(performance.now().toString()),
    name: request.name,
    type: 'private',
    avatar: '',
    members: uniqBy(
      (m) => m.id,
      [
        {
          id: request.auth.id,
          power: 0,
        },
        ...request.otherMemberIds.map((id) => ({
          id,
          power: 50,
        })),
      ],
    ),
    messageIds: [],
  };

  const result = await collection.insertOne(room);

  return room;
};
