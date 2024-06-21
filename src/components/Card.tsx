// import { JSX, ParentComponent } from 'solid-js';

// const Card: ParentComponent<{
//   scroll?: boolean;
//   size?: 'full' | 'fit' | 'auto';
//   type?: 'bold' | 'regular' | 'light';
//   // style?: JSX.CSSProperties;
//   background?: string;
// }> = (props) => {
//   if (!props.scroll) props.scroll = false;
//   if (!props.type) props.type = 'regular';
//   return (
//     <div
//       class={`p-1
//         ${props.scroll ? 'overflow-y-scroll' : 'overflow-clip'}
//         ${(() => {
//           switch (props.type) {
//             case 'bold':
//               return 'border-4 hover:shadow-xl';
//             case 'regular':
//               return 'border-2 hover:shadow-lg';
//             case 'light':
//               return 'border-1 hover:shadow-md';
//           }
//         })()} ${(() => {
//           switch (props.size) {
//             case 'full':
//               return 'w-full h-full';
//             case 'fit':
//               return 'w-fit h-fit';
//             case 'auto':
//               return 'w-auto h-auto';
//             case undefined:
//               return 'w-full h-fit';
//           }
//         })()}`}
//       style={
//         props.background
//           ? {
//               // ...props.style,
//               'background-image': `url("${props.background}")`,
//             }
//           : {
//               // ...props.style,
//             }
//       }
//     >
//       <div class="p-2">{props.children}</div>
//     </div>
//   );
// };

// export default Card;
