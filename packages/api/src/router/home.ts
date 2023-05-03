import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

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

export const homeRouter = createTRPCRouter({
  recentAndFavorites: publicProcedure
    .input(appFilterInput)
    .query(({ ctx, input }) => {
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
          // NOT: {
          //   platform: 'STEAMOS',
          // },
          name: search ? { search } : undefined,
          category: category ?? 'Entertainment',
          ownerId,
          userActions: {
            some: {
              userId,
            },
          },
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
    }),
})
