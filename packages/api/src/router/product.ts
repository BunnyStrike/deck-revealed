import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const productRouter = createTRPCRouter({
  subscriptions: publicProcedure.query(({ ctx, input }) => {
    return ctx.prisma.product.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        price: 'asc',
      },
    })
  }),
})
