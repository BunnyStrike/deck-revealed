import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const feedbackInput = z.object({
  id: z.string().optional(),
  content: z.string(),
  appId: z.string().optional(),
  type: z.enum(['BUG', 'FEATURE', 'OTHER']).default('OTHER'),
})

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure.input(feedbackInput).query(({ ctx, input }) => {
    const userId = ctx.user?.id
    const { id, content, type, appId } = input

    return ctx.prisma.feedback.upsert({
      where: { id },
      create: { content, type, appId, userId } as any,
      update: { content, type },
    })
  }),
})
