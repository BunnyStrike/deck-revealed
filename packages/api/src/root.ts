// import { authRouter } from "./router/auth";
import { appRouter as appR } from './router/app'
import { bootVideoRouter } from './router/bootVideo'
import { gameRouter } from './router/game'
import { homeRouter } from './router/home'
import { seedRouter } from './router/seed'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  app: appR,
  game: gameRouter,
  seed: seedRouter,
  bootVideo: bootVideoRouter,
  user: userRouter,
  home: homeRouter,
  // auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
