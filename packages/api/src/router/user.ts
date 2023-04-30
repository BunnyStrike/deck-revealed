import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const userInput = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    isFavorited: z.boolean().optional(),
    sort: z
      .string()
      .includes('desc')
      .or(z.string().includes('asc'))
      .default('desc'),
    ownerId: z.string().optional(),
  })
  .default({ search: undefined, sort: 'desc' })

export const userRouter = createTRPCRouter({
  // all: publicProcedure.input(userInput).query(({ ctx }) => {
  //   return ctx.prisma.user.findMany({})
  // }),
  // byId: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ ctx, input }) => {
  //     // TODO: get how long to beat data
  //     // TODO: cache how long to beat data
  //     // TODO: get steam data
  //     // TODO: cache steam data
  //     return ctx.prisma.user.findFirst({ where: { id: input.id } })
  //   }),
  upsert: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        email: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, email } = input
      return ctx.prisma.user.upsert({
        where: { id },
        create: { id, email },
        update: { email },
      })
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const id = input
    if (id === ctx.user?.id) {
      throw new Error('Unauthorized')
    }
    return ctx.prisma.user.delete({ where: { id } })
  }),
})
