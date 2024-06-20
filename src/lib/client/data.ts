import localForage from 'localforage';
import { clone } from 'ramda';
import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Message } from '~/types/message';
import { PrivateProfile, Profile, PublicProfile } from '~/types/profile';
import { Room } from '~/types/room';

const [data, setData] = createStore<
  Partial<{
    // `self` has to be set first
    self: PrivateProfile;
    contacts: PublicProfile[];
    messages: Message[];
    rooms: Room[];
  }>
>((await localForage.getItem('data')) || {});

createEffect(async () => {
  await localForage.setItem('data', clone(data));
});

export { data, setData };
