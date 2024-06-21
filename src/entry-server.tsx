// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';
import { onMount } from 'solid-js';

export default createHandler(() => {
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
            {assets}
          </head>
          <body>
            <div
              id="app"
              style={{
                display: 'contents',
              }}
            >
              {children}
            </div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
