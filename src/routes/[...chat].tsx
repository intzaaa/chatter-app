import { useNavigate, useParams } from '@solidjs/router';
import { isEmpty, isNil, remove, set } from 'ramda';
import {
  JSX,
  ParentComponent,
  createEffect,
  createResource,
  onMount,
} from 'solid-js';
import { Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Portal } from 'solid-js/web';

// import Card from '~/components/Card';
import Chat from '~/components/Chat';
import Hr from '~/components/Hr';
import { createWindows } from '~/components/Windows';
import api from '~/lib/client/api';
import { data, setData } from '~/lib/client/data';
import { refetchData } from '~/lib/client/data';
import { AddProfileToContact } from '~/types/profile';
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

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const [date, setTime] = createSignal(new Date());
  setInterval(() => setTime(new Date()), 1000);

  const { component: Windows, openWindow, closeWindow } = createWindows();

  createEffect(() => {
    if (params[base].length > base.length) {
      const window = (
        <Chat
          id={params[base]}
          close={() => {
            closeWindow(window);
            navigate(`/${base}`);
          }}
        ></Chat>
      );
      openWindow(window);
    }
  });

  onMount(async () => {
    await refetchData.self();
    await refetchData.contacts();
    await refetchData.rooms();
  });
  return (
    <div class="w-full h-full flex flex-col items-center justify-center p-8">
      <div class="card w-full h-full flex flex-col items-center justify-center overflow-clip">
        <div class="card w-full h-fit grow-0 shrink-0">
          <div class="text-4xl w-full h-fit flex flex-row gap-4">
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
        </div>
        <div class="w-full h-0 grow flex overflow-clip flex-col justify-center items-center md:flex-row m-0">
          <div class="card w-full h-full ">
            <div class="flex flex-row justify-between items-center">
              <h1 class="mb-2">Contacts</h1>

              <div>
                <button
                  onClick={async () => {
                    console.log('refreshing contacts');
                    await refetchData.contacts();
                  }}
                >
                  <h1 class="icon">refresh</h1>
                </button>
                <button
                  onClick={(event) => {
                    const window = (
                      <div class="card overflow-x-clip overflow-y-scroll">
                        <form
                          class="flex flex-fow w-96"
                          onSubmit={async (event) => {
                            event.preventDefault();
                            const target = event.target as HTMLFormElement;
                            const id = target._id.value;

                            if (id === '') {
                              closeWindow(window);
                              return;
                            }

                            const result = await api.add.contact({
                              auth: {
                                id: data.self!.id,
                                password: data.self!.password,
                              },
                              id,
                            } as AddProfileToContact);

                            if (result === null) return;

                            setData('contacts', (contacts) =>
                              contacts ? [...contacts, result] : [result],
                            );
                            closeWindow(window);
                          }}
                        >
                          <input
                            name="_id"
                            class="input w-full"
                            placeholder="ID"
                          ></input>
                          <button type="submit" class="icon text-3xl p-2">
                            check
                          </button>
                        </form>
                      </div>
                    );

                    openWindow(window);
                  }}
                >
                  <h1 class="icon">add</h1>
                </button>
              </div>
            </div>

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
                    const result = await api.get.room.byMemberIds({
                      auth: {
                        id: data!.self!.id,
                        password: data!.self!.password,
                      },
                      memberIds: [data!.self!.id, profile.id],
                    });

                    if (result !== null) {
                      const room = result[0];
                      navigate(`/${base}/${room.id}`);
                    } else {
                      const creation = await api.create.room({
                        auth: {
                          id: data!.self!.id,
                          password: data!.self!.password,
                        },
                        name: `${data!.self!.nickname} & ${profile.nickname}`,
                        type: 'private',
                        otherMemberIds: [profile.id],
                      });

                      if (creation === null) {
                        return;
                      }
                      setData('rooms', (rooms) =>
                        rooms ? [...rooms, creation] : [creation],
                      );
                      navigate(`/${base}/${creation.id}`);
                    }
                  }}
                  image={profile.avatar}
                  name={profile.nickname}
                  detail={profile.username}
                ></Item>
                {index !== array.length - 1 && <Hr></Hr>}
              </>
            ))}
          </div>

          <div class="card w-full h-full overflow-y-scroll">
            <h1 class="mb-2">Rooms</h1>
            {data?.rooms
              ?.filter((room) =>
                room.members.map((room) => room.id).includes(data!.self!.id),
              )
              .map((room, index, array) => (
                <>
                  <Item
                    click={() => {
                      navigate(`/${base}/${room.id}`);
                    }}
                    image={room.avatar}
                    name={room.name}
                    detail={room.type}
                  ></Item>
                  {index !== array.length - 1 && <Hr></Hr>}
                </>
              ))}
          </div>
        </div>
      </div>
      <Windows></Windows>
    </div>
  );
};
