import { z } from 'zod'

import { getSteamGames } from '../stores/steam/nonesteamgame'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const games = createTRPCRouter({
  steam: publicProcedure.query(async ({ input }) => {
    const games = await getSteamGames()
    return games ?? []
  }),
})
