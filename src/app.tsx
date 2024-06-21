import '@fontsource-variable/material-symbols-sharp';
import { Router, RouteSectionProps, useLocation } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { createResource, onMount, Suspense } from 'solid-js';

import MesseBasel from '~/images/MesseBasel.jpg';

import './app.css';
import { data } from './lib/client/data';

const Layout = (props: RouteSectionProps) => (
  <div class="contents">
    <img
      class="-z-[99999] pointer-events-none fixed left-0 top-0 h-full w-full select-none object-cover dark:invert"
      src={MesseBasel}
    ></img>
    <Suspense>{props.children}</Suspense>
  </div>
);

export default function App() {
  onMount(async () => {
    if (data.self && window.location.pathname === '/') {
      window.location.pathname = '/chat';
    }
    if (!data.self && window.location.pathname !== '/') {
      window.location.pathname = '/';
    }
  });
  return (
    <Router root={Layout}>
      <FileRoutes />
    </Router>
  );
}
