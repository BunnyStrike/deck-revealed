import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appInput = z
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

export const bootVideoRouter = createTRPCRouter({
  all: publicProcedure.input(appInput).query(({ ctx, input }) => {
    const { search } = input
    return ctx.prisma.bootVideo.findMany({
      where: {
        name: search ? { search } : undefined,
      },
      orderBy: { name: 'desc' },
    })
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bootVideo.findFirst({ where: { id: input.id } })
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        url: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bootVideo.create({ data: input })
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.bootVideo.delete({ where: { id: input } })
  }),
})
