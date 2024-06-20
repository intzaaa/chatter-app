import { JSX, ParentComponent } from 'solid-js';

const Card: ParentComponent<{
  scroll?: boolean;
  size?: 'full' | 'fit' | 'auto';
  type?: 'bold' | 'regular' | 'light';
  // style?: JSX.CSSProperties;
  background?: string;
}> = (props) => {
  if (!props.scroll) props.scroll = false;
  if (!props.size) props.size = 'auto';
  if (!props.type) props.type = 'regular';
  return (
    <div
      class={`m-1 grow flex flex-col border-black bg-white bg-cover p-2 text-black opacity-80 shadow-sm hover:opacity-[97.5%] dark:border-white dark:bg-black dark:text-white 
        ${props.scroll ? 'overflow-y-scroll' : 'overflow-clip'} 
        ${(() => {
          switch (props.type) {
            case 'bold':
              return 'border-4 hover:shadow-xl';
            case 'regular':
              return 'border-2 hover:shadow-lg';
            case 'light':
              return 'border-1 hover:shadow-md';
          }
        })()} ${(() => {
          switch (props.size) {
            case 'full':
              return 'w-full h-full';
            case 'fit':
              return 'w-fit h-fit';
            case 'auto':
              return 'w-auto h-auto';
          }
        })()}`}
      style={
        props.background
          ? {
              // ...props.style,
              'background-image': `url("${props.background}")`,
            }
          : {
              // ...props.style,
            }
      }
    >
      {props.children}
    </div>
  );
};

export default Card;
