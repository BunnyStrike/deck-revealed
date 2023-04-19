// import { authRouter } from "./router/auth";
import { appRouter as appR } from './router/app'
import { gameRouter } from './router/game'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  app: appR,
  game: gameRouter,
  // auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
