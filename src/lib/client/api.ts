import { isEmpty } from 'ramda';

import type { Login } from '~/types/login';
import type * as TM from '~/types/message';
import type * as TP from '~/types/profile';
import type * as TR from '~/types/room';

import { data, setData } from './data';

const expirationDuration: number = 1000 * 60 * 5;

const f = async <R, F>(endpoint: string, fallback: F, body: any) => {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return (await res.json()) as R;
    }
    return fallback as F;
  } catch (err) {
    console.error(err);
    return fallback as F;
  }
};

const getProfiles = async (
  input: TP.GetProfilesByNickname | TP.GetProfilesByIds,
) => {
  return await f<TP.Profile[], []>('/api/get/profile', [], input);
};

export default {
  login: async (input: Login) =>
    await f<TP.PrivateProfile, null>('/api/login', null, input),
  get: {
    profile: {
      byIds: async (input: TP.GetProfilesByIds) => {
        const local = [...data.contacts!, data.self!].filter((profile) =>
          input.ids.includes(profile.id),
        );

        if (
          local &&
          local.length > 0 &&
          Date.now() - local[0].at < expirationDuration
        )
          return local;

        const result = await f<TP.Profile[], []>('/api/get/profile', [], input);
        if (isEmpty(result)) return [];

        setData('contacts', (profiles) =>
          profiles
            ? [
                ...profiles,
                ...result.map((profile) => ({ ...profile, at: Date.now() })),
              ]
            : result.map((profile) => ({ ...profile, at: Date.now() })),
        );
        return result;
      },
      byNickname: async (input: TP.GetProfilesByNickname) => {
        const local = [...data.contacts!, data.self!].filter(
          (profile) => profile.nickname === input.nickname,
        );

        if (
          local &&
          local.length > 0 &&
          Date.now() - local[0].at < expirationDuration
        )
          return local;

        const result = await f<TP.Profile[], []>('/api/get/profile', [], input);
        if (isEmpty(result)) return [];

        setData('contacts', (profiles) =>
          profiles
            ? [
                ...profiles,
                ...result.map((profile) => ({ ...profile, at: Date.now() })),
              ]
            : result.map((profile) => ({ ...profile, at: Date.now() })),
        );
        return result;
      },
      byUsername: async (
        input: TP.GetProfileByUsername,
      ): Promise<TP.Profile | null> => {
        const local = [...data.contacts!, data.self!].find(
          (profile) => profile.username === input.username,
        );

        if (local && Date.now() - local.at < expirationDuration) return local;

        const result = await f<TP.Profile[], null>(
          '/api/get/profile',
          null,
          input,
        );
        if (result === null) return null;

        if (input.username === data.self!.username) setData('self', result[0]);
        else
          setData('contacts', (profiles) =>
            profiles
              ? [...profiles, { ...result[0], at: Date.now() }]
              : [{ ...result[0], at: Date.now() }],
          );
        return result[0];
      },
      // byEmail: async (input: TP.GetProfileByEmail) => await getProfile(input),
    },
    room: {
      byId: async (input: TR.GetRoomById) => {
        const _ = await f<TR.Room[], []>('/api/get/room', [], input);
        if (isEmpty(_)) return null;

        return _[0];
      },
      byName: async (input: TR.GetRoomsByName) =>
        await f<TR.Room[], []>('/api/get/room', [], input),
      byMemberIds: async (input: TR.GetRoomsByMemberIds) =>
        await f<TR.Room[], []>('/api/get/room', [], input),
    },
    message: {
      byIds: async (input: TM.GetMessagesByIds) =>
        await f<TM.Message[], []>('/api/get/message', [], input),
      byRoomId: async (input: TM.GetMessagesByRoomId) =>
        await f<TM.Message[], []>('/api/get/message', [], input),
    },
  },
  create: {
    profile: async (input: TP.CreateProfile) =>
      await f<TP.Profile, null>('/api/create/profile', null, input),
    room: async (input: TR.CreateRoom) =>
      await f<TR.Room, null>('/api/create/room', null, input),
    message: async (input: TM.CreateMessage) =>
      await f<TM.Message, null>('/api/create/message', null, input),
  },
  add: {
    contact: async (input: TP.AddProfileToContact) =>
      await f<TP.Profile, null>('/api/add/contact', null, input),
    member: async (input: TR.AddMember) =>
      await f<TR.Room, null>('/api/add/member', null, input),
    message: async (input: TM.AddMessages) =>
      await f<TM.Message, null>('/api/add/message', null, input),
  },
  remove: {
    profile: async (input: TP.RemoveProfile) =>
      await f<TP.Profile, null>('/api/remove/profile', null, input),
    room: async (input: TR.RemoveRoom) =>
      await f<TR.Room, null>('/api/remove/room', null, input),
    /* message: async (input: TM.RemoveMessage) =>
      await f<TM.Message, null>('/api/remove/message', null, input), */
  },
};
