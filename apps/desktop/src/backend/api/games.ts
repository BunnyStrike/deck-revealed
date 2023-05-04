import { z } from 'zod'

import { getSteamGames } from '../stores/steam/nonesteamgame'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const games = createTRPCRouter({
  steam: publicProcedure
    .output(
      z.array(
        z.object({
          name: z.string(),
          installdir: z.string(),
          buildid: z.number(),
          appid: z.number(),
          userConfig: z.object({ language: z.string() }),
          images: z.object({
            cover: z.string().nullable(),
            banner: z.string().nullable(),
            icon: z.string().nullable(),
          }),
          sizeOnDisk: z.number(),
          lastUpdated: z.number(),
          stateFlags: z.number(),
          launcherPath: z.string(),
        })
      )
    )
    .query(async () => {
      const games = await getSteamGames()
      return games ?? []
    }),
})
