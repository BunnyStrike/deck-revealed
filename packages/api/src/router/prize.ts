import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const prizeRouter = createTRPCRouter({
  viewPrizeFromClaimCode: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.prize.findFirst({ where: { claimCode: input.id } })
    }),
  claim: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const prize = await ctx.prisma.prize.findFirst({
        where: { claimCode: input.id },
      })

      if (prize?.claimedAt) throw new Error('Prize already claimed')

      return ctx.prisma.prize.update({
        where: { claimCode: input.id },
        data: {
          claimedAt: new Date(),
        },
      })
    }),
})
