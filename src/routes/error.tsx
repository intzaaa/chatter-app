import { A, useParams } from '@solidjs/router';

export default () => {
  console.error('Params:', useParams().error);
  return (
    <div class="flex h-dvh w-full flex-col-reverse bg-red-600 select-none">
      <div class="m-4 flex w-fit flex-row bg-red-700 p-2 font-bold">
        <div class="border-8 border-white p-4 text-8xl font-mono">ERROR</div>
        <div class="m-4 text-4xl font-sans">
          <p class="text-4xl">Route Not Found</p>
          <p class="text-6xl underline underline-offset-8 hover:text-white">
            <A href="/">Return Home</A>
          </p>
        </div>
      </div>
    </div>
  );
};
