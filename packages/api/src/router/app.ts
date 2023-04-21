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

export const appRouter = createTRPCRouter({
  all: publicProcedure.input(appInput).query(({ ctx, input }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories\
    const where = {
      name: { search: input.search },
      category: input.category,
      ownerId: input.ownerId,
      userActions: {},
    }
    if (input.isFavorited) {
      where.userActions = {
        some: { userId: input.ownerId, favoritedAt: { not: null } },
      }
    }
    return ctx.prisma.app.findMany({
      where,
      // @ts-expect-error
      orderBy: { createdAt: input.sort },
    })
  }),
  apps: publicProcedure.input(appInput).query(({ ctx, input }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories
    return ctx.prisma.app.findMany({
      where: {
        versions: { none: { platform: 'STEAMOS' } },
        category: input.category,
        name: { search: input.search },
        ownerId: input.ownerId,
      },
      // @ts-expect-error
      orderBy: { createdAt: input.sort },
      include: {
        versions: true,
        userActions: {
          where: {
            userId: input.ownerId,
          },
        },
      },
    })
  }),
  steamos: publicProcedure.input(appInput).query(({ ctx, input }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories
    return ctx.prisma.app.findMany({
      where: {
        versions: { some: { platform: 'STEAMOS' } },
        category: input.category,
        name: { search: input.search },
        ownerId: input.ownerId,
      },
      // @ts-expect-error
      orderBy: { createdAt: input.sort },
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
  recent: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id
    if (!userId) {
      throw new Error('Not logged in')
    }

    return ctx.prisma.userActionApp.upsert({
      where: { userId_appId: { appId: input, userId } },
      update: {
        recentAt: new Date(),
      },
      create: {
        appId: input,
        userId,
        recentAt: new Date(),
      },
    })
  }),
  favorite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // TODO: only allow delete if user is admin
      // TODO: only allow apps to delete if they are the owner
      const userId = ctx.session?.user.id
      if (!userId) {
        throw new Error('Not logged in')
      }

      const userAppAction = await ctx.prisma.userActionApp.findFirst({
        where: { appId: input, userId },
      })

      if (!!userAppAction?.favoritedAt) {
        return ctx.prisma.userActionApp.create({
          data: {
            appId: input,
            userId,
            favoritedAt: new Date(),
          },
        })
      } else {
        return ctx.prisma.userActionApp.upsert({
          where: { userId_appId: { appId: input, userId } },
          update: {
            favoritedAt: null,
          },
          create: {
            appId: input,
            userId,
            favoritedAt: new Date(),
          },
        })
      }
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    // TODO: only allow delete if user is admin
    // TODO: only allow apps to delete if they are the owner
    return ctx.prisma.app.delete({ where: { id: input } })
  }),
})
