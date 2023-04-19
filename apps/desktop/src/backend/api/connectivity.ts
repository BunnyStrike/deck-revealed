import { z } from 'zod'

import { type ConnectivityStatus } from '~/common/types'
import {
  getConnectivityStatus,
  isOnline,
  retry,
  setMonitorStatus,
} from '../utils/onlineMonitor'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const connectivity = createTRPCRouter({
  setStatus: publicProcedure
    .input(
      z.object({
        status: z
          .string()
          .includes('online')
          .or(z.string().includes('offline'))
          .or(z.string().includes('check-online')),
      })
    )
    .mutation((req) =>
      setMonitorStatus(req.input.status as ConnectivityStatus)
    ),
  retry: publicProcedure
    .input(
      z.object({
        seconds: z.number(),
      })
    )
    .mutation((req) => retry(req.input.seconds)),
  status: publicProcedure.query(() => getConnectivityStatus()),
  isOnline: publicProcedure.query(() => isOnline()),
})
