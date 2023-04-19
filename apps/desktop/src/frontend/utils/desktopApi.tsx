import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
  loggerLink,
} from '@trpc/react-query'
import { ipcLink } from 'electron-trpc/renderer'
import superjson from 'superjson'

import type { AppRouter as ServerAppRouter } from '@revealed/api'

import type { AppRouter } from '../../backend/api'
import { getEnvVar } from './envVar'

const getBaseUrl = () => {
  // if (typeof window !== 'undefined') return '' // browser should use relative url
  if (getEnvVar('VITE_VERCEL_URL')) return getEnvVar('VITE_VERCEL_URL') // SSR should use vercel url
}
//  & ServerAppRouter
// export const desktopApi = createTRPCReact<AppRouter>()
export const desktopApi = createTRPCProxyClient<AppRouter>({
  links: [
    ipcLink(),
    // loggerLink({
    //   enabled: (opts) =>
    //     process.env.NODE_ENV === 'development' ||
    //     (opts.direction === 'down' && opts.result instanceof Error),
    // }),
    // httpBatchLink({
    //   url: `${getBaseUrl()}/api/trpc`,
    //   fetch(url, options) {
    //     console.log(url, options)
    //     return fetch(url, {
    //       ...options,
    //       credentials: 'include',
    //     })
    //   },
    // }),
  ],
  transformer: superjson,
})

// /**
//  * A wrapper for your app that provides the TRPC context.
//  * Use only in _app.tsx
//  */
// export const DesktopApiProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [queryClient] = useState(() => new QueryClient())
//   const [trpcClient] = useState(() =>
//     desktopApi.createClient({
//       links: [
//         ipcLink(),
//         // loggerLink({
//         //   enabled: (opts) =>
//         //     process.env.NODE_ENV === 'development' ||
//         //     (opts.direction === 'down' && opts.result instanceof Error),
//         // }),
//         // httpBatchLink({
//         //   url: `${getBaseUrl()}/api/trpc`,
//         //   fetch(url, options) {
//         //     console.log(url, options)
//         //     return fetch(url, {
//         //       ...options,
//         //       credentials: 'include',
//         //     })
//         //   },
//         // }),
//       ],
//       transformer: superjson,
//     })
//   )

//   return (
//     <desktopApi.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//     </desktopApi.Provider>
//   )
// }
