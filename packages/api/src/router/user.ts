import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const userInput = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    isFavorited: z.boolean().optional(),
    sort: z
      .string()
      .includes('desc')
      .or(z.string().includes('asc'))
      .default('desc'),
    ownerId: z.string().optional(),
  })
  .default({ search: undefined, sort: 'desc' })

export const userRouter = createTRPCRouter({
  // all: publicProcedure.input(userInput).query(({ ctx }) => {
  //   return ctx.prisma.user.findMany({})
  // }),
  // byId: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ ctx, input }) => {
  //     // TODO: get how long to beat data
  //     // TODO: cache how long to beat data
  //     // TODO: get steam data
  //     // TODO: cache steam data
  //     return ctx.prisma.user.findFirst({ where: { id: input.id } })
  //   }),
  upsert: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        role: z
          .enum(['ADMIN', 'PRO', 'PRO_PLUS', 'EDITOR', 'USER'])
          .default('USER'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, isAdmin, user } = ctx
      const { id, name, email, role } = input

      if (
        (user?.id !== id && role !== 'ADMIN') ||
        (user?.id !== id && !isAdmin)
      ) {
        throw new Error('Unauthorized')
      }

      await ctx.prisma.user.upsert({
        where: { id },
        create: { id, name, email, role },
        update: { name, email, role },
      })

      if (id) {
        try {
          const { error } = await createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
            process.env.SUPABASE_SERVICE_ROLE_KEY ??
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
              ''
          ).auth.admin.updateUserById(id, {
            app_metadata: { role },
          })
          if (error) {
            throw new Error("Couldn't update user")
          }
        } catch (error) {
          throw new Error("Couldn't update user")
        }
      }
      //  else {
      //   await supabase?.auth.admin.createUser({
      //     email,
      //     app_metadata: { role },
      //   })
      // }
    }),
  changeRole: protectedProcedure
    .input(
      z.object({
        role: z.enum(['ADMIN', 'PRO', 'PRO_PLUS', 'EDITOR', 'USER']),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, isAdmin = false, user } = ctx
      const { id } = user!
      const { role, userId } = input

      if (!isAdmin) {
        throw new Error('Unauthorized')
      }

      await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ??
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
          ''
      )?.auth.admin.updateUserById(userId, {
        app_metadata: { role },
      })
      return ctx.prisma.user.update({ where: { id: userId }, data: { role } })
    }),
  changePlan: protectedProcedure
    .input(
      z.object({
        role: z.enum(['PRO', 'PRO_PLUS', 'USER']),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { supabase, isAdmin = false, user } = ctx
      const { id } = user!
      const { role, userId } = input

      // TODO: add stripe logic here

      await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ??
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
          ''
      )?.auth.admin.updateUserById(userId, {
        app_metadata: { role },
      })
      return ctx.prisma.user.update({ where: { id: userId }, data: { role } })
    }),
  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { user, prisma } = ctx

    if (!user?.id) {
      throw new Error('Not authenticated')
    }

    const data = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    })

    if (!data) {
      throw new Error('Could not find user')
    }

    return data.stripeSubscriptionStatus
  }),
  all: protectedProcedure.query(async ({ ctx }) => {
    const { user, prisma } = ctx

    if (!user?.id) {
      throw new Error('Not authenticated')
    }

    const data = await prisma.user.findMany()

    if (!data) {
      throw new Error('Could not find user')
    }

    return data
  }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const { isAdmin = false, user } = ctx
    const id = input

    if (user?.id !== id || !isAdmin) {
      throw new Error('Unauthorized')
    }

    return ctx.prisma.user.delete({ where: { id } })
  }),
})
