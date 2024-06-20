import { useNavigate, useParams } from '@solidjs/router';
import { isEmpty, isNil } from 'ramda';
import { JSX, createEffect, createResource, onMount } from 'solid-js';
import { Component, createSignal } from 'solid-js';

import Card from '~/components/Card';
import Chat from '~/components/Chat';
import Hr from '~/components/Hr';
import { data, setData } from '~/lib/client/data';
import { PublicProfile } from '~/types/profile';
import { CreateRoom, GetRoomsByMemberIds, Room } from '~/types/room';

const base = 'chat';

const Item: Component<{
  image: string;
  name: string;
  detail: string;
  click?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>;
}> = ({ image, name, detail, click }) => {
  return (
    <div
      class="flex flex-row w-full p-2 h-16 gap-4 items-center cursor-pointer"
      onClick={click}
    >
      {image === '' ? (
        <div class="w-auto h-full aspect-square bg-gray-500"></div>
      ) : (
        <img class="w-auto h-full aspect-square" alt={name} src={image}></img>
      )}
      <div class="text-2xl font-bold">{name}</div>
      <div class="text-2xl font-thin opacity-75">{detail}</div>
    </div>
  );
};

const ChatWindow: Component<{}> = () => {
  return (
    <dialog class="fixed w-full h-full bg-transparent flex flex-col items-center justify-center p-16 max-w-[1024px]">
      <Card size="full"></Card>
    </dialog>
  );
};

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const [date, setTime] = createSignal(new Date());
  setInterval(() => setTime(new Date()), 1000);

  const refreshContacts = async () => {
    if (isEmpty(data.self?.contactIds)) return;
    const contacts = await fetch('/api/get/profile', {
      method: 'POST',
      body: JSON.stringify({
        auth: {
          id: data.self!.id,
          password: data.self!.password,
        },
        ids: data.self?.contactIds,
      }),
    });

    if (contacts.ok) {
      const json = await contacts.json();
      setData('contacts', json);
    }
  };

  const refreshRooms = async () => {
    const rooms = await fetch('/api/get/room', {
      method: 'POST',
      body: JSON.stringify({
        auth: {
          id: data.self!.id,
          password: data.self!.password,
        },
        memberIds: [data.self!.id],
      } as GetRoomsByMemberIds),
    });

    if (rooms.ok) {
      const json = await rooms.json();
      setData('rooms', json);
    }
  };

  onMount(() => {
    refreshContacts();
    refreshRooms();
  });

  createEffect(() => {
    console.log(data);
  });
  return (
    <div class="w-full h-full flex flex-col items-center justify-center p-8">
      <Card type="bold" size="full">
        <Card>
          <div class="text-4xl p-2 flex flex-row gap-4">
            <div class="text-nowrap font-bold grow">
              {(() => {
                const hours = date().getHours();
                if (hours < 6) return 'Good night';
                if (hours < 12) return 'Good morning';
                if (hours < 18) return 'Good afternoon';
                return 'Good evening';
              })()}
              ,&nbsp
              <wbr />
              {data?.self?.nickname}!
            </div>
            <div class="text-right grow">
              {date().toLocaleDateString()} <wbr />
              {date().toLocaleTimeString()}
            </div>
          </div>
        </Card>
        <div class="w-full h-full flex flex-col justify-center items-center md:flex-row">
          <Card size="full" scroll>
            <h1 class="mb-2">Contacts</h1>

            {data?.contacts?.map((profile, index, array) => (
              <>
                <Item
                  click={async (event) => {
                    const _room = data.rooms?.find((room) => {
                      return (
                        room.members.filter((member) => {
                          return (
                            member.id === data.self!.id ||
                            member.id === profile.id
                          );
                        }).length === 2
                      );
                    });
                    if (_room) {
                      navigate(`/${base}/${_room.id}`);
                    }
                    const room = await fetch('/api/get/room', {
                      method: 'POST',
                      body: JSON.stringify({
                        auth: {
                          id: data!.self!.id,
                          password: data!.self!.password,
                        },
                        memberIds: [data!.self!.id, profile.id],
                      } as GetRoomsByMemberIds),
                    });

                    if (room.ok) {
                      const json = await room.json();
                      console.log(json);
                      if (isEmpty(json)) {
                        const create = await fetch('/api/create/room', {
                          method: 'POST',
                          body: JSON.stringify({
                            auth: {
                              id: data!.self!.id,
                              password: data!.self!.password,
                            },
                            name: `${data!.self!.nickname} & ${profile.nickname}`,
                            type: 'private',
                            otherMemberIds: [data!.self!.id, profile.id],
                          } as CreateRoom),
                        });

                        if (create.ok) {
                          const json = await create.json();
                          setData('rooms', (rooms) =>
                            rooms ? [...rooms, json] : [json],
                          );
                          navigate(`/${base}/${json.id}`);
                        }
                      }
                    }
                  }}
                  image={profile.avatar}
                  name={profile.nickname}
                  detail={profile.username}
                ></Item>
                {index !== array.length - 1 && <Hr></Hr>}
              </>
            ))}
          </Card>

          <Card size="full" scroll>
            <h1 class="mb-2">Rooms</h1>
            {data?.rooms
              ?.filter((room) =>
                room.members.map((room) => room.id).includes(data!.self!.id),
              )
              .map((room, index, array) => (
                <>
                  <Item
                    image={room.avatar}
                    name={room.name}
                    detail={room.type}
                  ></Item>
                  {index !== array.length - 1 && <Hr></Hr>}
                </>
              ))}
          </Card>
        </div>
      </Card>
      {params[base].length > base.length && <ChatWindow></ChatWindow>}
    </div>
  );
};
