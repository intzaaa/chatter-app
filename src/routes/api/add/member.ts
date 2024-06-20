import { APIEvent } from '@solidjs/start/server';

import { getDb, auth } from '~/lib/server/db';
import { AddMember, Room } from '~/types/room';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as AddMember;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<Room>('rooms');

  const result = await collection.findOneAndUpdate(
    {
      id: request.roomId,
      members: {
        $elemMatch: { id: request.id, power: { $lte: 50 } },
        $not: { $elemMatch: { id: request.id } },
      },
    },
    {
      $push: {
        members: {
          id: request.id,
          power: 50,
        },
      },
    },
  );

  if (result === null) return new Response('Member not added', { status: 404 });

  return result;
};
