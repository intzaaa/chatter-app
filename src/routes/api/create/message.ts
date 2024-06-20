import { APIEvent } from '@solidjs/start/server';
import { sha256 } from 'hash-wasm';

import { getDb, auth } from '~/lib/server/db';
import { Message, CreateMessage } from '~/types/message';

export const POST = async (event: APIEvent) => {
  const request = (await event.request.json()) as CreateMessage;

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<Message>('messages');

  const message: Message = {
    ...request,
    id: await sha256(performance.now().toString()),
    timestamp: Date.now(),
  };

  const result = await collection.insertOne(message);

  return message;
};
