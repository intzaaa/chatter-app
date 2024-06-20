import { Router, RouteSectionProps, useLocation } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { createResource, onMount, Suspense } from 'solid-js';

import './app.css';
import { data } from './lib/client/data';

const Layout = (props: RouteSectionProps) => {
  return (
    <div class="contents">
      <Suspense>{props.children}</Suspense>
    </div>
  );
};

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
