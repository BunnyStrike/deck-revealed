import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'

import type { AppRouter } from '@revealed/api'

import { getEnvVar } from '~/common/envVar'

const getBaseUrl = () => {
  return getEnvVar('VITE_VERCEL_URL') ?? `http://localhost:3000` // dev SSR should use localhost
}

export const serverClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBaseUrl(),
      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   }
      // },
    }),
  ],
  // @ts-ignore
  transformer: superjson,
})
