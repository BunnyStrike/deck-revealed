import { z } from 'zod'

import { type ConnectivityStatus, type Runner } from '~/common/types'
import { getWikiGameInfo } from '../info/wikiGameInfo'
import {
  getConnectivityStatus,
  isOnline,
  retry,
  setMonitorStatus,
} from '../utils/onlineMonitor'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const info = createTRPCRouter({
  getWikiGameInfo: publicProcedure
    .input(
      z.object({
        title: z.string(),
        name: z.string(),
        runner: z.string(),
      })
    )
    .query(({ input }) =>
      getWikiGameInfo(input.title, input.name, input.runner as Runner)
    ),
})
