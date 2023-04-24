// import { authRouter } from "./router/auth";
import { appRouter as appR } from './router/app'
import { gameRouter } from './router/game'
import { seedRouter } from './router/seed'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  app: appR,
  game: gameRouter,
  seed: seedRouter,
  // auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
