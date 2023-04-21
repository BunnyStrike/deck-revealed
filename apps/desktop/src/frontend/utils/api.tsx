import { useState } from 'react'
// import { httpBatchLink, loggerLink } from '@trpc/client'
import { useSession } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink, splitLink } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { ipcLink } from 'electron-trpc/renderer'
import superjson from 'superjson'

import type { AppRouter } from '@revealed/api'

import type { AppRouter as DesktopAppRouter } from '../../backend/api'
import { getEnvVar } from './envVar'

const getBaseUrl = () => {
  return getEnvVar('VITE_VERCEL_URL') ?? `http://localhost:3002` // dev SSR should use localhost
}

export const api = createTRPCReact<AppRouter & DesktopAppRouter>()

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>

export type AppListInput = RouterInput['app']['all']
export type AppUpsertInput = RouterInput['app']['upsert']
export type AppListOutput = RouterOutput['app']['all']

export type GameListInput = RouterInput['game']['all']
export type GameListOutput = RouterOutput['game']['all']

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useSession()
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        splitLink({
          condition(op) {
            return op.path.includes('desktop.')
          },
          true: ipcLink(),
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            // fetch(url, options) {
            //   return fetch(url, {
            //     ...options,
            //     credentials: 'include',
            //   })
            // },
            async headers() {
              const sess = await session?.getToken()
              console.log(sess)
              if (!sess) return {}
              return {
                Authorization: `Bearer ${sess}`,
              }
            },
          }),
        }),
      ],
      transformer: superjson,
    })
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}

// // export { type RouterInputs, type RouterOutputs } from '@revealed/api'
