import localForage from 'localforage';
import { clone } from 'ramda';
import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Message } from '~/types/message';
import { PrivateProfile, Profile, PublicProfile } from '~/types/profile';
import { Room } from '~/types/room';

import api from './api';

type At = {
  at: number;
};

type Data = {
  // `self` has to be set first
  self: PrivateProfile & At;
  contacts: (PublicProfile & At)[];
  messages: (Message & At)[];
  rooms: (Room & At)[];
};

const [data, setData] = createStore<Partial<Data>>(
  (await localForage.getItem('data')) || {},
);

createEffect(async () => {
  await localForage.setItem('data', clone(data));
});

const refetchData: {
  [key in keyof Data]: () => Promise<void>;
} = {
  self: async () => {
    const result = await api.get.profile.byUsername({
      auth: {
        id: data.self!.id,
        password: data.self!.password,
      },
      username: data.self!.username,
    });

    if (result === null) return;

    setData('self', result);
  },
  contacts: async () => {
    const result = await api.get.profile.byIds({
      auth: {
        id: data.self!.id,
        password: data.self!.password,
      },
      ids: data.self!.contactIds,
    });

    if (result === null) return;

    setData(
      'contacts',
      result.map((profile) => ({ ...profile, at: Date.now() })),
    );
  },
  rooms: async () => {
    const result = await api.get.room.byMemberIds({
      auth: {
        id: data.self!.id,
        password: data.self!.password,
      },
      memberIds: [data.self!.id],
    });

    if (result === null) return;

    setData(
      'rooms',
      result.map((room) => ({ ...room, at: Date.now() })),
    );
  },
  messages: async () => {},
};

export { data, setData, refetchData };
