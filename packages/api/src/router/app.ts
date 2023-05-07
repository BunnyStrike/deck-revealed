import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const appFilterInput = z
  .object({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    cursor: z.number().default(0),
    category: z.string().optional(),
    isFavorited: z.boolean().optional(),
    showHidden: z.boolean().optional(),
    platform: z.enum(['WINDOWS', 'LINUX', 'STEAMOS', 'MAC', 'WEB']).optional(),
    notPlatform: z
      .enum(['WINDOWS', 'LINUX', 'STEAMOS', 'MAC', 'WEB'])
      .optional(),
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
  source: z.string().min(1),
  description: z.string().optional(),
  type: z
    .enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER'])
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
  uninstall: z.string().optional(),
  installLocation: z.string().optional(),
  runnerLocation: z.string().optional(),
  status: z.string().default('PUBLISHED'),
  platform: z
    .enum(['WINDOWS', 'LINUX', 'STEAMOS', 'MAC', 'WEB', 'OTHER'])
    .default('OTHER'),
  runnerType: z
    .enum([
      'FLATPAK',
      'APPIMAGE',
      'BASH',
      'EXE',
      'WEB',
      'MSI',
      'DMG',
      'UNKNOWN',
    ])
    .default('UNKNOWN'),
})

const appInput = {
  name: z.string().min(1),
  source: z.string().min(1),
  description: z.string().optional(),
  authorName: z.string().optional(),
  iconUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  backgroundUrl: z.string().optional(),
  authorUrl: z.string().optional(),
  publisherName: z.string().optional(),
  publisherUrl: z.string().optional(),
  category: z.string().default('Entertainment'),
  ownerId: z.string().optional(),
  platform: z.any().optional(),
  store: z.any().optional(),
  uninstall: z.string().optional(),
  installLocation: z.string().optional(),
  runnerLocation: z.string().optional(),
  runnerType: z.any().optional(),
  // media: z.array(mediaInput).optional(),
  // versions: z.array(versionInput).optional(),
}

export const appRouter = createTRPCRouter({
  all: publicProcedure.input(appFilterInput).query(async ({ ctx, input }) => {
    const {
      showHidden = false,
      isFavorited,
      userId,
      platform,
      notPlatform,
      limit = 50,
      cursor,
    } = input
    // TODO: get only apps that don't have userId and userId that matches current user
    // TODO: filter list based on categories\
    const where = {
      name: { search: input.search },
      category: input.category,
      ownerId: input.ownerId,
      // userActions: {},
      NOT: notPlatform
        ? {
            platform: notPlatform,
          }
        : undefined,
      platform: platform,
    }
    // if (userId) {
    //   where.userActions = {
    //     some: {
    //       userId,
    //     },
    //     none: {
    //       favoritedAt: isFavorited ? { not: null } : null,
    //       hideAt: showHidden ? { not: null } : null,
    //     },
    //   }
    // }
    const count = await ctx.prisma.app.count({ where })
    const list = await ctx.prisma.app.findMany({
      take: (limit || 50) + 1,
      skip: cursor,
      where,
      // cursor: typeof cursor === 'number' ? { id: cursor } : undefined,
      orderBy: {
        name: input.sort as any,
      },
      include: {
        versions: true,
        userActions: {
          where: {
            userId,
          },
        },
      },
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
  apps: publicProcedure.input(appFilterInput).query(async ({ ctx, input }) => {
    const userId = ctx.user?.id
    const {
      showHidden = false,
      isFavorited,
      // userId,
      search,
      category,
      ownerId,
      limit = 50,
      cursor,
    } = input

    const where = {
      NOT: {
        platform: 'STEAMOS',
      },
      name: search ? { search } : undefined,
      category: input.category ?? 'Entertainment',
      ownerId: input.ownerId,
      // userActions: {},
    }
    // if (userId) {
    //   where.userActions = {
    //     // some: {
    //     // userId,
    //     // favoritedAt: isFavorited ? { not: null } : null,
    //     // hideAt: showHidden ? { not: null } : null,
    //     // },
    //     // none: {
    //     //   favoritedAt: isFavorited ? { not: null } : null,
    //     //   hideAt: showHidden ? { not: null } : null,
    //     // },
    //   }
    // }

    const apps = await ctx.prisma.app.findMany({
      take: (limit || 50) + 1,
      // cursor: typeof cursor === 'number' ? { id: cursor } : undefined,
      where: {
        NOT: {
          platform: 'STEAMOS',
        },
        name: search ? { search } : undefined,
        category: category ?? 'Entertainment',
        ownerId,
      },
      orderBy: {
        name: input.sort as any,
      },
      include: {
        versions: true,
        userActions: {
          where: {
            userId,
          },
        },
      },
    })

    let nextCursor: typeof cursor | undefined = undefined

    return apps
  }),
  steamos: publicProcedure.input(appFilterInput).query(({ ctx, input }) => {
    // TODO: get only apps that don't have userId and userId that matches current user
    const userId = ctx.user?.id
    const {
      showHidden = false,
      isFavorited,
      // userId,
      search,
      category,
      ownerId,
    } = input

    return ctx.prisma.app.findMany({
      where: {
        platform: 'STEAMOS',
        category: category,
        name: { search },
        ownerId: ownerId,
      },
      orderBy: { createdAt: input.sort as any },
      include: {
        versions: true,
        userActions: {
          where: {
            userId,
          },
        },
      },
    })
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string().optional() }))
    .query(({ ctx, input }) => {
      const userId = ctx.user?.id
      // TODO: get wiki data
      const { id } = input
      return ctx.prisma.app.findFirst({
        where: { id: id },
        include: {
          versions: true,
          userActions: {
            where: {
              userId,
            },
          },
        },
      })
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
        id: z.string(),
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
        source,
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
      return ctx.prisma.app.upsert({
        where: { id },
        update: {
          name,
          source,
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
          source,
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id
      // const userId = ctx.session?.user.id
      const { id } = input

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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user?.id
      const { id } = input
      if (!userId) {
        throw new Error('Not logged in')
      }

      const userAppAction = await ctx.prisma.userActionApp.findFirst({
        where: { appId: id, userId },
      })

      return ctx.prisma.userActionApp.upsert({
        where: { userId_appId: { appId: id, userId } },
        update: { favoritedAt: userAppAction?.favoritedAt ? null : new Date() },
        create: {
          appId: id,
          userId,
          favoritedAt: new Date(),
        },
      })
    }),
  delete: publicProcedure
    .input(z.object({ ownerId: z.string(), id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { ownerId, id } = input
      const userId = ctx.user?.id
      if (ownerId !== userId || ctx.user?.user_metadata?.role !== 'ADMIN')
        return
      // console.log(Object.keys(ctx))
      // TODO: only allow delete if user is admin
      // TODO: only allow apps to delete if they are the owner
      return ctx.prisma.app.deleteMany({
        where: { id }, //, ownerId: ownerId ? ownerId : undefined
      })
    }),
})
