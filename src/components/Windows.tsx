import type { JSX } from 'solid-js';
import { createStore } from 'solid-js/store';

export const createWindows = () => {
  const [windows, setWindows] = createStore<
    {
      element: JSX.Element;
      onClose?: Function;
    }[]
  >([]);

  const openWindow = (element: JSX.Element, onClose?: Function) => {
    setWindows((windows) => [...windows, { element, onClose }]);
  };

  const closeWindow = (element: JSX.Element) => {
    setWindows((windows) =>
      windows.filter((w) => {
        const _ = w.element !== element;
        if (!_) {
          w.onClose?.();
        }
        return _;
      }),
    );
  };

  return {
    component: () => (
      <>
        {windows.map((window, index) => {
          return (
            <div
              style={{
                'z-index': 9999 + index,
              }}
              class="fixed w-full h-full bg-transparent flex flex-col items-center justify-center p-16 max-w-[1024px]"
              onClick={(event) => {
                if (event.target !== event.currentTarget) return;

                closeWindow(window.element);
              }}
            >
              <div class="contents">{window.element}</div>
            </div>
          );
        })}
      </>
    ),
    openWindow,
    closeWindow,
  };
};
