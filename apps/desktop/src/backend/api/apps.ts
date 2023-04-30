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
        appInfo: z.any(),
      })
    )
    .mutation(({ input }) => runScript(input.appInfo)),
  runApp: publicProcedure
    .input(
      z.object({
        appInfo: z.any(),
      })
    )
    .mutation(({ input }) => runApp(input.appInfo)),
  isAppInstalled: publicProcedure
    .input(
      z.object({
        appInfo: z.any(),
      })
    )
    .mutation(({ input }) => isAppInstalled(input.appInfo)),
  uninstallApp: publicProcedure
    .input(
      z.object({
        appInfo: z.any(),
      })
    )
    .mutation(({ input }) => uninstallApp(input.appInfo)),
})
