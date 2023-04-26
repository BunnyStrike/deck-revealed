import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { Clerk, clerkClient } from '@clerk/nextjs/dist/api'
import { getServerSession as $getServerSession } from 'next-auth'

import { authOptions } from './auth-options'

type GetServerSessionContext =
  | {
      req: GetServerSidePropsContext['req']
      res: GetServerSidePropsContext['res']
    }
  | { req: NextApiRequest; res: NextApiResponse }
export const getServerSession = (ctx: GetServerSessionContext) => {
  return $getServerSession(ctx.req, ctx.res, authOptions)
}

// export const getServersideSession = async (ctx: GetServerSessionContext) => {
//   // const authorization = request.headers.authorization;
//   // // let's remove the Bearer and whitespace part from the header
//   // const clerkToken = authorization.replace("Bearer ", "");
//   // const decodeInfo = clerk.decodeJwt(clerkToken);
//   // const sessionId = decodeInfo.payload.sid;
//   Clerk({
//     apiKey: process.env.NEXT_PUBLIC_CLERK_API_KEY,

//   })
// }
