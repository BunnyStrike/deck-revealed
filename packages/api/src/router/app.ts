import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const appRouter = createTRPCRouter({
  all: publicProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(({ ctx, input }) => {
      // TODO: get only apps that don't have userId and userId that matches current user
      // TODO: filter list based on categories
      return ctx.prisma.app.findMany({
        // @ts-expect-error
        where: { name: { search: input.search } },
        orderBy: { createdAt: 'desc' },
      })
    }),
  apps: publicProcedure.query(({ ctx }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories
    return ctx.prisma.app.findMany({
      where: { versions: { none: { platform: 'STEAMOS' } } },
      orderBy: { createdAt: 'desc' },
      include: { versions: true },
    })
  }),
  steamos: publicProcedure.query(({ ctx }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories
    return ctx.prisma.app.findMany({
      where: { versions: { some: { platform: 'STEAMOS' } } },
      orderBy: { createdAt: 'desc' },
      include: { versions: true },
    })
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // TODO: get wiki data
      return ctx.prisma.app.findFirst({ where: { id: input.id } })
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.app.create({ data: input })
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    // TODO: only allow delete if user is admin
    // TODO: only allow apps to delete if they are the owner
    return ctx.prisma.app.delete({ where: { id: input } })
  }),
})
