import { defineConfig } from '@solidjs/start/config';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  ssr: false,
  // vite: {
  //   plugins: [
  //     devtools({
  //       /* features options - all disabled by default */
  //       autoname: true, // e.g. enable autoname
  //     }),
  //   ],
  // },
});
