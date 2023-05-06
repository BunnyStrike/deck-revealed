import { z } from 'zod'

import {
  installBootVideo,
  isAppInstalled,
  isFlatpakInstalled,
  runApp,
  runScript,
  uninstallApp,
} from '../apps'
import {
  addNonSteamApp,
  isAppAddedToSteam,
  removeNonSteamApp,
} from '../stores/steam/nonesteamapp'
import { createTRPCRouter, publicProcedure } from './trpc'

export const appType = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
  authorUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  iconUrl: z.string().nullable().optional(),
  installLocation: z.string().nullable().optional(),
  ownerId: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  platform: z.string().default('WEB'),
  publisherName: z.string().nullable().optional(),
  publisherUrl: z.string().nullable().optional(),
  runnerLocation: z.string().nullable().optional(),
  runnerType: z.string().nullable().optional(),
  saveLocation: z.string().nullable().optional(),
  sha256: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  store: z.string().nullable().optional(),
  storeUrl: z.string().nullable().optional(),
  subCategory: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  uninstall: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  userActions: z.any(),
})

export type AppDoc = z.infer<typeof appType>

// Simulate keyboard and mouse actions as if the real input device is used
export const apps = createTRPCRouter({
  isFlatpakInstalled: publicProcedure
    .input(
      z.object({
        source: z.string(),
      })
    )
    .query(({ input }) => isFlatpakInstalled(input.source)),
  installBootVideo: publicProcedure
    .input(
      z.object({
        bootVideo: z.any(),
      })
    )
    .mutation(({ input }) => installBootVideo(input.bootVideo)),
  runScript: publicProcedure
    .input(
      z.object({
        app: appType,
      })
    )
    .mutation(({ input }) => runScript(input.app)),
  runApp: publicProcedure
    .input(
      z.object({
        app: appType,
      })
    )
    .mutation(({ input }) => runApp(input.app)),
  isAppInstalled: publicProcedure
    .input(
      z.object({
        app: z.any(),
      })
    )
    .query(({ input }) => isAppInstalled(input.app)),
  uninstallApp: publicProcedure
    .input(
      z.object({
        app: z.any(),
      })
    )
    .mutation(({ input }) => uninstallApp(input.app)),
})
