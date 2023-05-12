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
        id: z.string().min(1),
        email: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, email } = input
      return ctx.prisma.user.upsert({
        where: { id },
        create: { id, email },
        update: { email },
      })
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

      await supabase?.auth.admin.updateUserById(userId, {
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

      await supabase?.auth.admin.updateUserById(userId, {
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
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const id = input
    if (id === ctx.user?.id) {
      throw new Error('Unauthorized')
    }
    return ctx.prisma.user.delete({ where: { id } })
  }),
})
