// TODO
import { Component, JSX } from 'solid-js';

const Chat: Component<{
  id: string;
  close: () => void;
}> = ({ id, close }) => {
  const chat = (
    <div class="fixed w-full h-dvh backdrop:opacity-75 flex flex-col items-center justify-center p-0 md:p-16">
      <div class="w-full h-full">{id}</div>
      <button
        onClick={(event) => {
          close();
        }}
      >
        close
      </button>
    </div>
  );
  return chat;
};

export default Chat;
