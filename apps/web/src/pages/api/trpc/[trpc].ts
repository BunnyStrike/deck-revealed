import type { NextApiRequest, NextApiResponse } from 'next'
import { createNextApiHandler } from '@trpc/server/adapters/next'

import { appRouter, createTRPCContext } from '@revealed/api'

import { allowCors } from '~/utils/cors'
import { env } from '~/env.mjs'

// If you need to enable cors, you can do so like this:
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Let the tRPC handler do its magic
  return createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    batching: {
      enabled: true,
    },
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            )
          }
        : undefined,
  })(req, res)
}

export default allowCors(handler)
