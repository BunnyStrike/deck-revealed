import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

const bootVideoInput = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    isFavorited: z.boolean().optional(),
    limit: z.number().min(1).max(100).default(50),
    cursor: z.number().default(0),
    sort: z
      .string()
      .includes('desc')
      .or(z.string().includes('asc'))
      .default('desc'),
    ownerId: z.string().optional(),
  })
  .default({ search: undefined, sort: 'desc' })

export const bootVideoRouter = createTRPCRouter({
  all: publicProcedure.input(bootVideoInput).query(async ({ ctx, input }) => {
    const { search, limit = 50, cursor } = input

    const where = {
      name: search ? { search } : undefined,
    }

    const count = await ctx.prisma.bootVideo.count({ where })

    const list = await ctx.prisma.bootVideo.findMany({
      take: (limit || 50) + 1,
      skip: cursor,
      where,
      orderBy: { name: 'desc' },
    })

    let nextCursor: number | undefined = undefined
    if (list.length > limit) {
      nextCursor = list.length + 1
    }

    return {
      list,
      nextCursor,
      limit,
      count,
    }
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
