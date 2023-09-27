// import { authRouter } from "./router/auth";
import { adminRouter } from './router/admin'
import { appRouter as appR } from './router/app'
import { bootVideoRouter } from './router/bootVideo'
import { gameRouter } from './router/game'
import { homeRouter } from './router/home'
import { prizeRouter } from './router/prize'
import { productRouter } from './router/product'
import { seedRouter } from './router/seed'
import { stripeRouter } from './router/stripe'
import { userRouter } from './router/user'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  app: appR,
  game: gameRouter,
  seed: seedRouter,
  bootVideo: bootVideoRouter,
  user: userRouter,
  home: homeRouter,
  stripe: stripeRouter,
  admin: adminRouter,
  product: productRouter,
  prize: prizeRouter,
  // auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
