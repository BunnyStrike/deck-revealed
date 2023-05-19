import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const adminRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx, input }) => {
    const { supabase, isAdmin, user } = ctx

    const totalUsers = await ctx.prisma.user.count()
    const totalApps = await ctx.prisma.app.count()

    return {
      totalUsers,
      totalApps,
    }
  }),
  syncAuth: protectedProcedure.mutation(async ({ ctx }) => {
    const { prisma } = ctx

    const { data, error } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        ''
    ).auth.admin.listUsers()
    if (error) {
      throw new Error('Error fetching users from supabase')
    }

    return prisma.user.createMany({
      data: data.users.map((user) => ({
        id: user.id,
        email: user.email,
        role: 'USER',
      })),
      skipDuplicates: true,
    })
  }),
})
