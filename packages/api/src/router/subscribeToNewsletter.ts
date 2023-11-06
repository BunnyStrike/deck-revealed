import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

// const updateInput = z
//   .object({
//     title: z.string(),
//     content: z.string(),
//     updatedAt: z.date(),
//     createdAt: z.date(),
//   })

const subscribeToNewsletterInput = z.object({
  email: z.string(),
  updatedAt: z.date().optional(),
  createdAt: z.date().optional(),
})

export const subscribeToNewsletterRouter = createTRPCRouter({
  // all: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.update.findMany({ orderBy: { createdAt: 'desc' } })
  // }),
  // byId: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ ctx, input }) => {
  //     // TODO: get how long to beat data
  //     // TODO: cache how long to beat data
  //     // TODO: get steam data
  //     // TODO: cache steam data
  //     return ctx.prisma.update.findFirst({ where: { id: input.id } })
  //   }),
  create: publicProcedure
    .input(subscribeToNewsletterInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.subscribeToNewsletter.create({ data: input })
    }),
  // update: publicProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //       title: z.string(),
  //       content: z.string(),
  //       updatedAt: z.date(),
  //       createdAt: z.date(),
  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.update.update({
  //       where: { id: input.id },
  //       data: input,
  //     })
  //   }),
  // delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
  //   return ctx.prisma.update.delete({ where: { id: input } })
  // }),
})
