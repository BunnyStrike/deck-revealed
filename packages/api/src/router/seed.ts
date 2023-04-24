import { writeFileSync } from 'fs'
import { z } from 'zod'

import appsSeed from '../../../../apps.json'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const seedRouter = createTRPCRouter({
  saveApps: publicProcedure.mutation(async ({ ctx }) => {
    const apps = await ctx.prisma.app.findMany()

    writeFileSync('../../apps.json', JSON.stringify(apps))

    return apps
  }),
  restoreApps: publicProcedure
    .input(z.any())
    .mutation(async ({ ctx, input }) => {
      console.log(appsSeed[0])
      const apps = await ctx.prisma.app.createMany({ data: input })

      return apps
    }),
})
