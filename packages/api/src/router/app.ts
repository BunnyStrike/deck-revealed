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

const mediaInput = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  description: z.string().optional(),
  type: z
    .string()
    .includes('IMAGE')
    .or(
      z
        .string()
        .includes('VIDEO')
        .or(
          z
            .string()
            .includes('AUDIO')
            .or(
              z.string().includes('DOCUMENT').or(z.string().includes('OTHER'))
            )
        )
    )
    .default('OTHER'),
  steamType: z
    .string()
    .includes('COVER')
    .or(
      z
        .string()
        .includes('ICON')
        .or(z.string().includes('BANNER').or(z.string().includes('OTHER')))
    )
    .default('OTHER'),
})

const versionInput = z.object({
  version: z.string().optional(),
  sourceUrl: z.string().min(1),
  name: z.string().optional(),
  uninstallUrl: z.string().optional(),
  installLocation: z.string().optional(),
  runnerLocation: z.string().optional(),
  status: z.string().default('PUBLISHED'),
  platform: z
    .string()
    .includes('WINDOWS')
    .or(
      z
        .string()
        .includes('LINUX')
        .or(
          z
            .string()
            .includes('STEAMOS')
            .or(z.string().includes('MAC').or(z.string().includes('WEB')))
        )
    )
    .default('OTHER'),
  runnerType: z
    .string()
    .includes('FLATPAK')
    .or(
      z
        .string()
        .includes('APPIMAGE')
        .or(
          z
            .string()
            .includes('BASH')
            .or(
              z
                .string()
                .includes('EXE')
                .or(
                  z
                    .string()
                    .includes('WEB')
                    .or(
                      z.string().includes('MSI').or(z.string().includes('DMG'))
                    )
                )
            )
        )
    )
    .default('UNKNOWN'),
})

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
  upsert: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        url: z.string().min(1),
        description: z.string().optional(),
        authorName: z.string().optional(),
        coverUrl: z.string().optional(),
        authorUrl: z.string().optional(),
        publisherName: z.string().optional(),
        publisherUrl: z.string().optional(),
        category: z.string().default('Entertainment'),
        ownerId: z.string().optional(),
        media: z.array(mediaInput).optional(),
        versions: z.array(versionInput).optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const {
        name,
        url,
        description,
        authorName,
        authorUrl,
        coverUrl,
        publisherName,
        publisherUrl,
        category,
        ownerId,
        versions,
        media,
      } = input
      return ctx.prisma.app.upsert({
        where: { id: input.id },
        update: {
          name,
          url,
          description,
          authorName,
          coverUrl,
          authorUrl,
          publisherName,
          publisherUrl,
          category,
        },
        create: {
          name,
          url,
          description,
          authorName,
          authorUrl,
          coverUrl,
          publisherName,
          publisherUrl,
          category,
          ownerId,
          type: 'PUBLISHED',
          versions: {
            createMany: {
              // @ts-expect-error
              data: versions ?? [],
            },
          },
          appMedia: {
            createMany: {
              // @ts-expect-error
              data: media ?? [],
            },
          },
        },
      })
    }),
  // TODO: ability to add versions
  // TODO: ability to add media
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
  hide: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user.id
    if (!userId) {
      throw new Error('Not logged in')
    }

    return ctx.prisma.userActionApp.upsert({
      where: { userId_appId: { appId: input, userId } },
      update: {
        hideAt: new Date(),
      },
      create: {
        appId: input,
        userId,
        hideAt: new Date(),
      },
    })
  }),
  favorite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
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
