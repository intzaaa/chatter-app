import localForage from 'localforage';
import { clone } from 'ramda';
import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Message } from '~/types/message';
import { PrivateProfile, Profile, PublicProfile } from '~/types/profile';
import { Room } from '~/types/room';

import api from './api';

type Data = {
  // `self` has to be set first
  self: PrivateProfile;
  contacts: PublicProfile[];
  messages: Message[];
  rooms: Room[];
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

    setData('contacts', result);
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

    setData('rooms', result);
  },
  messages: async () => {},
};

export { data, setData, refetchData };
