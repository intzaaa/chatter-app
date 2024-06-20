import { useNavigate } from '@solidjs/router';
import { sha256 } from 'hash-wasm';
import { createSignal, Match, onMount, Switch } from 'solid-js';

import Card from '~/components/Card';
import Hr from '~/components/Hr';
import config from '~/config';
import MesseBasel from '~/images/MesseBasel.jpg';
import RedLine from '~/images/RedLine.svg';
import { data, setData } from '~/lib/client/data';
import { Login } from '~/types/login';
import { CreateProfile, PrivateProfile } from '~/types/profile';

// import { defaultHandler } from "~/data/handler";

// const handler = await defaultHandler("mongodb://localhost:27017", {}, "RedLine", {});

export default () => {
  const [login, setLogin] = createSignal(true);

  const navigator = useNavigate();

  let lock = false;
  return (
    <>
      <div class="flex h-full w-full items-center justify-center">
        <img
          class="pointer-events-none absolute left-0 top-0 h-full w-full select-none object-cover dark:invert"
          src={MesseBasel}
        ></img>
        <div>
          <Card>
            <div class="flex flex-row">
              <Card>
                <div class="flex h-full flex-col justify-between">
                  <div>
                    <h1 class="text-4xl font-bold">{config.name}</h1>
                    <p class="text-right italic">{config.slogan}</p>
                  </div>

                  <img
                    class="pointer-events-none select-none"
                    alt="RedLine Logo"
                    src={RedLine}
                  />
                </div>
              </Card>
              <Switch>
                <Match when={login()}>
                  <Card size="auto">
                    <div class="max-w-96">
                      <h1 class="mb-2 text-4xl font-bold">Login</h1>
                      <form
                        onSubmit={async (event) => {
                          event.preventDefault();

                          if (lock) return;

                          const target = event.target as HTMLFormElement;

                          lock = true;
                          const result = await fetch(`/api/login`, {
                            method: 'POST',
                            body: JSON.stringify({
                              username: target.username.value,
                              password: target.password.value,
                            } as Login),
                          });

                          if (result.ok) {
                            const json =
                              (await result.json()) as PrivateProfile;
                            setData('self', json);
                            navigator('/chat');
                          } else {
                            window.location.reload();
                          }
                        }}
                      >
                        <input
                          name="username"
                          class="input w-full"
                          type="text"
                          placeholder="Username"
                          autocomplete="username"
                        />
                        <Hr />
                        <input
                          name="password"
                          class="input w-full"
                          type="password"
                          placeholder="Password"
                          autocomplete="current-password"
                        />
                        <button class="button" type="submit">
                          Submit
                        </button>
                      </form>
                      <button
                        class="button inline-block w-fit"
                        onClick={() => setLogin(!login())}
                      >
                        ⇀ Create Account
                      </button>
                    </div>
                  </Card>
                </Match>
                <Match when={!login()}>
                  <Card size="auto">
                    <div class="max-w-96">
                      <h1 class="mb-2 text-4xl font-bold">Create Account</h1>
                      <form
                        onSubmit={async (event) => {
                          event.preventDefault();
                          if (lock) return;

                          const target = event.target as HTMLFormElement;

                          lock = true;
                          const result = await fetch('/api/create/profile', {
                            method: 'POST',
                            body: JSON.stringify({
                              nickname: target.nickname.value,
                              username: target.username.value,
                              password: target.password.value,
                              email: target.email.value,
                            } as CreateProfile),
                          });

                          if (result.ok) {
                            const json =
                              (await result.json()) as PrivateProfile;
                            setData('self', json);
                            navigator('/chat');
                          } else {
                            window.location.reload();
                          }
                        }}
                      >
                        <input
                          name="nickname"
                          class="input w-full"
                          type="text"
                          placeholder="Nickname"
                        />
                        <Hr />
                        <input
                          name="username"
                          class="input w-full"
                          type="text"
                          placeholder="Username"
                        />
                        <Hr />
                        <input
                          name="password"
                          class="input w-full"
                          type="password"
                          placeholder="Password"
                        />
                        <Hr />
                        <input
                          name="email"
                          class="input w-full"
                          type="email"
                          placeholder="Email"
                        />
                        <button class="button" type="submit">
                          Submit
                        </button>
                      </form>
                      <button
                        class="button inline-block w-fit"
                        onClick={() => setLogin(!login())}
                      >
                        ⇀ Login
                      </button>
                    </div>
                  </Card>
                </Match>
              </Switch>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
