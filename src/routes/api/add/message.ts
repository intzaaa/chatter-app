import { APIEvent } from '@solidjs/start/server';
import { isEmpty } from 'ramda';

import { getDb, auth } from '~/lib/server/db';
import { AddMessages, Message } from '~/types/message';
import { Room } from '~/types/room';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as AddMessages;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const mCollection = db.collection<Message>('messages');
  const rCollection = db.collection<Room>('rooms');

  const messages = mCollection
    .find({
      id: { $in: request.ids },
    })
    .toArray();

  if (isEmpty(messages))
    return new Response('Message not found', { status: 404 });

  const room = await rCollection.findOneAndUpdate(
    {
      id: request.roomId,
    },
    {
      $push: {
        messageIds: { $each: request.ids },
      },
    },
  );

  if (room === null) return new Response('Room not found', { status: 404 });

  return room;
};
