import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appFilterInput = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    isFavorited: z.boolean().optional(),
    showHidden: z.boolean().optional(),
    sort: z
      .string()
      .includes('desc')
      .or(z.string().includes('asc'))
      .default('desc'),
    ownerId: z.string().optional(),
    userId: z.string().optional(),
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

const appInput = {
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
  // media: z.array(mediaInput).optional(),
  // versions: z.array(versionInput).optional(),
}

export const appRouter = createTRPCRouter({
  all: publicProcedure.input(appFilterInput).query(({ ctx, input }) => {
    const { showHidden = false, isFavorited, userId } = input
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories\
    const where = {
      name: { search: input.search },
      category: input.category,
      ownerId: input.ownerId,
      userActions: {},
    }
    if (userId) {
      where.userActions = {
        some: {
          userId,
        },
        none: {
          favoritedAt: isFavorited ? { not: null } : null,
          hideAt: showHidden ? { not: null } : null,
        },
      }
    }
    return ctx.prisma.app.findMany({
      where,
      // @ts-expect-error
      orderBy: { createdAt: input.sort },
    })
  }),
  apps: publicProcedure.input(appFilterInput).query(({ ctx, input }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories
    const { showHidden = false, isFavorited, userId } = input

    const where = {
      // versions: { none: { platform: 'STEAMOS' } },
      name: { search: input.search },
      category: input.category,
      ownerId: input.ownerId,
      userActions: {},
    }
    if (userId) {
      where.userActions = {
        // some: {
        //   userId,
        //   favoritedAt: isFavorited ? { not: null } : null,
        //   hideAt: showHidden ? { not: null } : null,
        // },
        // none: {
        //   favoritedAt: isFavorited ? { not: null } : null,
        //   hideAt: showHidden ? { not: null } : null,
        // },
      }
    }

    return ctx.prisma.app.findMany({
      where,
      // @ts-expect-error
      orderBy: { createdAt: input.sort },
      // include: {
      //   versions: true,
      //   userActions: {
      //     where: {
      //       userId,
      //     },
      //   },
      // },
    })
  }),
  steamos: publicProcedure.input(appFilterInput).query(({ ctx, input }) => {
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
        ...appInput,
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.app.create({ data: input })
    }),
  update: publicProcedure
    .input(
      z.object({
        ...appInput,
        id: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.app.update({ where: { id: input.id }, data: input })
    }),
  upsert: publicProcedure
    .input(z.object({ ...appInput, id: z.string().optional() }))
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
        id = undefined,
        // versions,
        // media,
      } = input
      console.log(id)
      return ctx.prisma.app.upsert({
        where: { id },
        update: {
          name,
          url,
          description,
          authorName,
          coverUrl,
          authorUrl,
          publisherName,
          publisherUrl,
          // category,
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
          // category,
          ownerId,
          // type: 'PUBLISHED',
          // versions: {
          //   createMany: {
          //     // @ts-expect-error
          //     data: versions ?? [],
          //   },
          // },
          // appMedia: {
          //   createMany: {
          //     // @ts-expect-error
          //     data: media ?? [],
          //   },
          // },
        },
      })
    }),
  // TODO: ability to add versions
  // TODO: ability to add media
  recent: publicProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session?.user.id
      const { userId, id } = input

      if (!userId) {
        throw new Error('Not logged in')
      }

      return ctx.prisma.userActionApp.upsert({
        where: { userId_appId: { appId: id, userId } },
        update: {
          recentAt: new Date(),
        },
        create: {
          appId: id,
          userId,
          recentAt: new Date(),
        },
      })
    }),
  hide: publicProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session?.user.id
      const { userId, id } = input

      if (!userId) {
        throw new Error('Not logged in')
      }

      return ctx.prisma.userActionApp.upsert({
        where: { userId_appId: { appId: id, userId } },
        update: {
          hideAt: new Date(),
        },
        create: {
          appId: id,
          userId,
          hideAt: new Date(),
        },
      })
    }),
  favorite: publicProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session?.user.id
      const { userId, id } = input
      if (!userId) {
        throw new Error('Not logged in')
      }

      const userAppAction = await ctx.prisma.userActionApp.findFirst({
        where: { appId: id, userId },
      })

      if (!!userAppAction?.favoritedAt) {
        return ctx.prisma.userActionApp.create({
          data: {
            appId: id,
            userId,
            favoritedAt: new Date(),
          },
        })
      } else {
        return ctx.prisma.userActionApp.upsert({
          where: { userId_appId: { appId: id, userId } },
          update: {
            favoritedAt: null,
          },
          create: {
            appId: id,
            userId,
            favoritedAt: new Date(),
          },
        })
      }
    }),
  delete: publicProcedure
    .input(z.object({ ownerId: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { ownerId, id } = input
      // TODO: only allow delete if user is admin
      // TODO: only allow apps to delete if they are the owner
      return ctx.prisma.app.deleteMany({ where: { id, ownerId } })
    }),
})
