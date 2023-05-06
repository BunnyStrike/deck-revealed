import { z } from 'zod'

import { getSteamGames } from '../stores/steam/nonesteamgame'
import { createTRPCRouter, publicProcedure } from './trpc'

const sourceEnum = z.enum(['steam', 'nonsteam', 'epic', 'origin', 'uplay'])

// Simulate keyboard and mouse actions as if the real input device is used
export const games = createTRPCRouter({
  steam: publicProcedure
    .output(
      z.array(
        z.object({
          name: z.string(),
          appid: z.number(),
          installdir: z.string().nullable(),
          buildid: z.number().nullable(),
          userConfig: z.any(), // z.object({ language: z.string() }),
          images: z.object({
            cover: z.string().nullable(),
            banner: z.string().nullable(),
            icon: z.string().nullable(),
          }),
          sizeOnDisk: z.number().default(0),
          lastUpdated: z.number().nullable(),
          stateFlags: z.number().nullable(),
          launcherPath: z.string().nullable().default(null),
          source: sourceEnum,
        })
      )
    )
    .query(async () => {
      const games = await getSteamGames()

      return games ?? []
    }),
})
