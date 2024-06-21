import type { JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

export const createWindows = () => {
  const [windows, setWindows] = createStore<JSX.Element[]>([]);

  const openWindow = (element: JSX.Element) => {
    setWindows((windows) => [...windows, element]);
  };

  const closeWindow = (element: JSX.Element) => {
    setWindows((windows) => windows.filter((w) => w !== element));
  };

  return {
    component: () => (
      <>
        {windows.map((window, index) => (
          <div
            style={{
              'z-index': 9999 + index,
            }}
            class="fixed w-full h-full pointer-events-none bg-transparent flex flex-col items-center justify-center p-16 max-w-[1024px]"
          >
            <div class="contents pointer-events-auto">{window}</div>
          </div>
        ))}
      </>
    ),
    openWindow,
    closeWindow,
  };
};
