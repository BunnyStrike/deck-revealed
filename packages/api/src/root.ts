// import { authRouter } from "./router/auth";
import { appRouter as appR } from './router/app'
import { createTRPCRouter } from './trpc'

export const appRouter = createTRPCRouter({
  app: appR,
  // auth: authRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
