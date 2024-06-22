import { Component, JSX } from 'solid-js';

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

export default Item;
