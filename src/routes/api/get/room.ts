import { APIEvent } from '@solidjs/start/server';
import { isEmpty, isNil } from 'ramda';

import { getDb, auth } from '~/lib/server/db';
import type * as T from '~/types/room';

export const POST = async (event: APIEvent) => {
  const request = await event.request.json();

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<T.Room>('messages');

  if (request.id) {
    const _request = request as T.GetRoomById;
    const room = await collection.findOne({
      id: _request.id,
    });

    if (!room) return new Response('Room not found', { status: 404 });

    return [room];
  }

  if (request.name) {
    const _request = request as T.GetRoomsByName;
    const rooms = await collection
      .find({
        name: _request.name,
      })
      .toArray();

    if (isEmpty(rooms)) return new Response('Room not found', { status: 404 });

    if (request.memberIds) {
      const _request = request as T.GetRoomsByMemberIds;
      const rooms = await collection
        .find({
          members: { $elemMatch: { id: { $in: _request.memberIds } } },
        })
        .toArray();

      if (isEmpty(rooms))
        return new Response('Room not found', { status: 404 });
    }

    return rooms;
  }

  if (request.memberIds) {
    const _request = request as T.GetRoomsByMemberIds;
    const rooms = await collection
      .find({
        members: { $elemMatch: { id: { $in: _request.memberIds } } },
      })
      .toArray();

    if (isEmpty(rooms)) return new Response('Room not found', { status: 404 });

    return rooms;
  }

  return new Response('Bad Request', { status: 400 });
};
