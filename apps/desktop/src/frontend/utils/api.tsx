import { useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
// import { httpBatchLink, loggerLink } from '@trpc/client'
// import { useSession } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink, splitLink } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { ipcLink } from 'electron-trpc/renderer'
import superjson from 'superjson'

import type { AppRouter } from '@revealed/api'

import type { DesktopRouter } from '../../backend/api'
import { supabaseClient } from './database'
import { getEnvVar } from './envVar'

const getBaseUrl = () => {
  return getEnvVar('VITE_VERCEL_URL') || 'https://revealed-tau.vercel.app' // ?? `http://localhost:3000` // dev SSR should use localhost
}

export const api = createTRPCReact<AppRouter & DesktopRouter>()

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>

type DesktopRouterInput = inferRouterInputs<DesktopRouter>
type DesktopRouterOutput = inferRouterOutputs<DesktopRouter>

export type AppListInput = RouterInput['app']['all']
export type AppUpsertInput = RouterInput['app']['upsert']
export type AppListOutput = RouterOutput['app']['all']['list']

export type GameListInput = RouterInput['game']['all']
export type GameListOutput = RouterOutput['game']['all']

export type SteamGameListOutput =
  DesktopRouterOutput['desktop']['games']['steam']

export type BootVideoInput = RouterInput['bootVideo']['all']
export type BootVideoOutput = RouterOutput['bootVideo']['all']['list']

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useUser()
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
            async headers() {
              const session = await supabaseClient.auth.getSession()
              const token = session.data.session?.access_token
              if (!token) return {}
              return {
                Authorization: `Bearer ${token}`,
              }
            },
          }),
        }),
      ],
      // @ts-ignore
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
