import type { Login } from '~/types/login';
import type * as TM from '~/types/message';
import type * as TP from '~/types/profile';
import type * as TR from '~/types/room';

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

const getProfile = async (
  input: TP.GetProfileByEmail | TP.GetProfileByUsername,
) => {
  const result = await f<TP.Profile[], null>('/api/get/profile', null, input);
  if (result === null) return null;

  return result[0];
};

const getProfiles = async (
  input: TP.GetProfilesByNickname | TP.GetProfilesByIds,
) => await f<TP.Profile[], []>('/api/get/profile', [], input);

export default {
  login: async (input: Login) =>
    await f<TP.PrivateProfile, null>('/api/login', null, input),
  get: {
    profile: {
      byIds: async (input: TP.GetProfilesByIds) => await getProfiles(input),
      byNickname: async (input: TP.GetProfilesByNickname) =>
        await getProfiles(input),
      byUsername: async (input: TP.GetProfileByUsername) =>
        await getProfile(input),
      byEmail: async (input: TP.GetProfileByEmail) => await getProfile(input),
    },
    room: {
      byId: async (input: TR.GetRoomById) =>
        await f<TR.Room, null>('/api/get/room', null, input),
      byName: async (input: TR.GetRoomsByName) =>
        await f<TR.Room[], []>('/api/get/room', [], input),
      byMemberIds: async (input: TR.GetRoomsByMemberIds) =>
        await f<TR.Room[], []>('/api/get/room', [], input),
    },
    message: {
      byIds: async (input: TM.GetMessagesByIds) =>
        await f<TM.Message, null>('/api/get/message', null, input),
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
