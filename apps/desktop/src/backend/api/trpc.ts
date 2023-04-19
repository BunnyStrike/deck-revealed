import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

export const t = initTRPC.create({ isServer: true, transformer: superjson })

export const createTRPCRouter = t.router

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure

// import z from 'zod';
// import { initTRPC } from '@trpc/server';
// import { observable } from '@trpc/server/observable';
// import { EventEmitter } from 'events';
// import superjson from 'superjson';

// const ee = new EventEmitter();

// const t = initTRPC.create({ isServer: true, transformer: superjson });

// export const router = t.router({
//   greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
//     const { input } = req;

//     ee.emit('greeting', `Greeted ${input.name}`);
//     return {
//       text: `Hello ${input.name}` as const,
//     };
//   }),
//   subscription: t.procedure.subscription(() => {
//     return observable((emit) => {
//       function onGreet(text: string) {
//         emit.next({ text });
//       }

//       ee.on('greeting', onGreet);

//       return () => {
//         ee.off('greeting', onGreet);
//       };
//     });
//   }),
// });

// export type AppRouter = typeof router;
