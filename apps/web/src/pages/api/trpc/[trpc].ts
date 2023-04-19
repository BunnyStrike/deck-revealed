import type { NextApiRequest, NextApiResponse } from 'next'
import { createNextApiHandler } from '@trpc/server/adapters/next'

import { appRouter, createTRPCContext } from '@revealed/api'

import { allowCors } from '~/utils/cors'
import { env } from '~/env.mjs'

// export API handler
// export default createNextApiHandler({
//   router: appRouter,
//   createContext: createTRPCContext,
// });

// If you need to enable cors, you can do so like this:
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Enable cors
  // await cors(req, res)

  console.log('test-')

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
