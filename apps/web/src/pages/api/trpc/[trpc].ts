import type { NextApiRequest, NextApiResponse } from 'next'
import { clerkClient, withAuth } from '@clerk/nextjs/dist/api'
import { getAuth } from '@clerk/nextjs/server'
import { createNextApiHandler } from '@trpc/server/adapters/next'

// import jwt from 'jsonwebtoken'

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

  // console.log('test-')
  // const decoded = jwt.verify(
  //   req.headers.authorization?.replace('Bearer ', ''),
  //   process.env.CLERK_SECRET_KEY
  // )

  // console.log('decoded', decoded)

  // // const user = getAuth(req)
  // console.log('user', req)

  // const test = clerkClient({
  //   apiKey: process.env.NEXT_PUBLIC_CLERK_API_KEY,
  // })

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
