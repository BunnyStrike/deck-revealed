import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { httpBatchLink, loggerLink } from '@trpc/client'
import {
  createTRPCProxyClient,
  createTRPCReact,
  httpBatchLink,
} from '@trpc/react-query'
import { ipcLink } from 'electron-trpc/renderer'
import superjson from 'superjson'

import type { AppRouter } from '@revealed/api'

import type { AppRouter as DesktopAppRouter } from '../../backend/api'
import { getEnvVar } from './envVar'

const getBaseUrl = () => {
  return getEnvVar('VITE_VERCEL_URL') ?? `http://localhost:3002` // dev SSR should use localhost
}

export const api = createTRPCReact<AppRouter & DesktopAppRouter>()

// export const desktopApi = createTRPCReact<DesktopAppRouter>()

// export const api = createTRPCProxyClient<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: 'http://localhost:4000/trpc',
//     }),
//   ],
// }); // createTRPCReact

// // export const api = createTRPCReact<AppRouter>() // createTRPCReact

// // export const apiQueryClient = () => new QueryClient()
// // export const apiCLient = () =>
// //   api.createClient({
// //     url: `${getBaseUrl()}/api/trpc`,
// //     transformer: superjson,
// //     // transformer: superjson,
// //     // links: [
// //     //   loggerLink({
// //     //     enabled: (opts) =>
// //     //       process.env.NODE_ENV === 'development' ||
// //     //       (opts.direction === 'down' && opts.result instanceof Error),
// //     //   }),
// //     //   httpBatchLink({
// //     //     url: `${getBaseUrl()}/api/trpc`,
// //     //   }),
// //     // ],
// //   })
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // fetch(url, options) {
          //   return fetch(url, {
          //     ...options,
          //     credentials: 'include',
          //   })
          // },
        }),
        // ipcLink(),
      ],
      transformer: superjson,
    })
  )
  // const [trpcDesktopClient] = useState(() =>
  //   desktopApi.createClient({
  //     links: [ipcLink()],
  //     transformer: superjson,
  //   })
  // )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      {/* <desktopApi.Provider client={trpcClient} queryClient={queryClient}>, */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      {/* </desktopApi.Provider> */}
    </api.Provider>
  )
}

// // export { type RouterInputs, type RouterOutputs } from '@revealed/api'
