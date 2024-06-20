import { APIEvent } from '@solidjs/start/server';
import { isEmpty, isNil } from 'ramda';

import { getDb, auth } from '~/lib/server/db';
import { Auth } from '~/types/auth';
import type * as T from '~/types/profile';

export const POST = async (event: APIEvent) => {
  const request = await event.request.json();

  const db = await getDb();

  if (!(await auth(request.auth, db)))
    return new Response('Unauthorized', { status: 401 });

  const collection = db.collection<T.PrivateProfile>('profiles');

  const removePrivateData = (profile: T.PrivateProfile) => {
    const { password, email, contactIds: contacts, ...rest } = profile;

    if (rest.id === (request.auth as Auth).id) {
      return profile;
    }

    return rest;
  };

  if (request.id) {
    const _request = request as T.GetProfileById;

    const profile = await collection.findOne({
      id: _request.id,
    });

    if (profile === null)
      return new Response('Profile not found', { status: 404 });

    return [removePrivateData(profile)];
  }

  if (request.ids) {
    const _request = request as T.GetProfilesByIds;

    const profiles = await collection
      .find({
        id: { $in: _request.ids },
      })
      .toArray();

    if (isEmpty(profiles))
      return new Response('Profile not found', { status: 404 });

    return profiles.map(removePrivateData);
  }

  if (request.nickname) {
    const _request = request as T.GetProfilesByNickname;

    const profiles = await collection
      .find({
        nickname: _request.nickname,
      })
      .toArray();

    if (isEmpty(profiles))
      return new Response('Profile not found', { status: 404 });

    return profiles.map(removePrivateData);
  }

  if (request.username) {
    const _request = request as T.GetProfileByUsername;

    const profile = await collection.findOne({
      username: _request.username,
    });

    if (profile === null)
      return new Response('Profile not found', { status: 404 });

    return [removePrivateData(profile)];
  }

  if (request.email) {
    const _request = request as T.GetProfileByEmail;

    const profile = await collection.findOne({
      email: _request.email,
    });

    if (profile === null)
      return new Response('Profile not found', { status: 404 });

    return [removePrivateData(profile)];
  }

  return new Response('Bad Request', { status: 400 });
};
