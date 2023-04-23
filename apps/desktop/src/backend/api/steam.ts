import { z } from 'zod'

import {
  addNonSteamApp,
  isAppAddedToSteam,
  removeNonSteamApp,
} from '../stores/steam/nonesteamapp'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const steam = createTRPCRouter({
  addAppToSteam: publicProcedure
    .input(
      z.object({
        appInfo: z.any(),
      })
    )
    .mutation(({ input }) => addNonSteamApp(input.appInfo)),
  removeAppFromSteam: publicProcedure
    .input(
      z.object({
        appInfo: z.any(),
      })
    )
    .mutation(({ input }) => removeNonSteamApp(input.appInfo)),
  isAddedToSteam: publicProcedure
    .input(
      z.object({
        title: z.string(),
        steamUserdataDir: z.string()?.optional(),
      })
    )
    .query(({ input }) => isAppAddedToSteam(input)),
})
