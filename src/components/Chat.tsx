import { Component, JSX, createResource } from 'solid-js';

import api from '~/lib/client/api';
import { data } from '~/lib/client/data';

const Chat: Component<{
  id: string;
  close: Function;
}> = ({ id, close }) => {
  const [room] = createResource(
    async () =>
      await api.get.room.byId({
        auth: {
          id: data.self!.id,
          password: data.self!.password,
        },
        id: id,
      }),
  );

  const [messages] = createResource(
    async () =>
      await api.get.message.byRoomId({
        auth: {
          id: data.self!.id,
          password: data.self!.password,
        },
        roomId: id,
        from: Date.now() - 1000 * 60 * 60 * 24,
        to: Date.now(),
      }),
  );
  const chat = (
    <div class="card w-full h-[75dvh] flex flex-row justify-center items-center">
      <div class="grow-[2] w-0 flex flex-col h-full">
        <div class="card grow-0 h-fit">
          <h1>{room()?.name}</h1>
        </div>
        <div class="card grow h-0 flex flex-col">
          <div class="h-0 grow flex flex-col-reverse card">
            {messages()?.map((message) => {
              const [owner] = createResource(() =>
                api.get.profile.byIds({
                  auth: {
                    id: data.self!.id,
                    password: data.self!.password,
                  },
                  ids: [message.owner],
                }),
              );
              return (
                <p>
                  {owner()?.[0].nickname}: {message.content}
                </p>
              );
            })}
          </div>
          <form
            class="card h-fit flex flex-row justify-center items-center"
            onSubmit={async (event) => {
              event.preventDefault();
              const target = event.target as HTMLFormElement;
              const content = target.content.value;
              if (content === '') return;

              const result = await api.create.message({
                auth: {
                  id: data.self!.id,
                  password: data.self!.password,
                },
                roomId: id,
                content,
              });

              if (result === null) return;

              target.content.value = '';
            }}
          >
            <input
              name="content"
              class="input w-0 grow"
              type="text"
              placeholder="Message"
            />
            <button class="icon text-4xl p-2 grow-0 w-fit">send</button>
          </form>
        </div>
      </div>
      <div class="grow w-0 card h-full">
        <h1>Members</h1>
        {room()?.members.map((member) => {
          const [profile] = createResource(() =>
            api.get.profile.byIds({
              auth: {
                id: data.self!.id,
                password: data.self!.password,
              },
              ids: [member.id],
            }),
          );
          return <div>{profile()?.[0].nickname}</div>;
        })}
      </div>
    </div>
  );
  return chat;
};

export default Chat;
