import { APIEvent } from '@solidjs/start/server';
import { isEmpty } from 'ramda';

import { getDb, auth } from '~/lib/server/db';
import type * as T from '~/types/message';

export const POST = async (event: APIEvent) => {
  const request = await event.request.json();

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<T.Message>('messages');

  if (request.roomId) {
    const _request = request as T.GetMessagesByRoomId;
    const messages = await collection
      .find({
        rooms: [_request.roomId],
        timestamp: { $gte: _request.from, $lte: _request.to },
      })
      .toArray();

    if (isEmpty(messages))
      return new Response('Message not found', { status: 404 });

    return messages;
  }

  if (request.messageIds) {
    const _request = request as T.GetMessagesByIds;
    const messages = await collection
      .find({ id: { $in: _request.messageIds } })
      .toArray();

    if (isEmpty(messages))
      return new Response('Message not found', { status: 404 });

    return messages;
  }

  return new Response('Bad Request', { status: 400 });
};
