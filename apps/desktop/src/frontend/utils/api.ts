import { QueryClient } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createReactQueryHooks } from '@trpc/react'
import superjson from 'superjson'

import type { AppRouter } from '@revealed/api'

import { getEnvVar } from './envVar'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${getEnvVar('VITE_VERCEL_URL')}` // SSR should use vercel url

  return `http://localhost:3000` // dev SSR should use localhost
}

export const api = createReactQueryHooks<AppRouter>()

export const apiQueryClient = () => new QueryClient()
export const apiCLient = () =>
  api.createClient({
    url: `${getBaseUrl()}/api/trpc`,
    transformer: superjson,
    // transformer: superjson,
    // links: [
    //   loggerLink({
    //     enabled: (opts) =>
    //       process.env.NODE_ENV === 'development' ||
    //       (opts.direction === 'down' && opts.result instanceof Error),
    //   }),
    //   httpBatchLink({
    //     url: `${getBaseUrl()}/api/trpc`,
    //   }),
    // ],
  })

export { type RouterInputs, type RouterOutputs } from '@revealed/api'
