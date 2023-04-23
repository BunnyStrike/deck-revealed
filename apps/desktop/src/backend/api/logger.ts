import { z } from 'zod'

import { logInfo } from '../logger/logger'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const logger = createTRPCRouter({
  logInfo: publicProcedure
    .input(
      z.object({
        message: z.any(),
        options: z.any().optional(),
      })
    )
    .mutation(({ input }) => logInfo(input.message, input.options)),
})
