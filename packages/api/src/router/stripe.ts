import { z } from 'zod'

import { getOrCreateStripeCustomerIdForUser } from '../stripe/stripe-webhook-handlers'
import { createTRPCRouter, protectedProcedure } from '../trpc'

/* 
  Stripe Test Cards

  https://stripe.com/docs/testing#cards

  4242 4242 4242 4242	Visa	Any 3 digits	Any future date
  4000 0025 0000 3155	Visa (debit)	Any 3 digits	Any future date
  5555 5555 5555 4444	Mastercard	Any 3 digits	Any future date

*/

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        quantity: z.number().optional(),
        isTrial: z.boolean().optional(),
        mode: z.enum(['subscription', 'payment', 'setup']).optional(),
        metadata: z.object({}).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { stripe, user, prisma, req } = ctx
      const {
        priceId,
        quantity = 1,
        isTrial = false,
        mode = 'subscription',
        metadata = {},
      } = input

      if (!user?.id) {
        throw new Error('Unauthorized')
      }

      const customerId = await getOrCreateStripeCustomerIdForUser({
        prisma,
        stripe,
        userId: user?.id,
      })

      if (!customerId) {
        throw new Error('Could not create customer')
      }

      const baseUrl =
        process.env.NODE_ENV === 'development'
          ? `http://${req.headers.host ?? 'localhost:3000'}`
          : `https://${req.headers.host ?? process.env.VITE_VERCEL_URL}`

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user?.id,
        payment_method_types: ['card'],
        mode,
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        success_url: `${baseUrl}/account?checkoutSuccess=true`,
        cancel_url: `${baseUrl}/account?checkoutCanceled=true`,
        payment_intent_data:
          mode === 'payment'
            ? {
                metadata: {
                  userId: user?.id,
                  ...metadata,
                },
              }
            : undefined,
        subscription_data:
          mode === 'subscription'
            ? {
                trial_from_plan: isTrial,
                metadata: {
                  userId: user?.id,
                  ...metadata,
                },
              }
            : undefined,
      })

      if (!checkoutSession) {
        throw new Error('Could not create checkout session')
      }

      return { checkoutUrl: checkoutSession.url }
    }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, user, prisma, req } = ctx

    if (!user?.id) {
      throw new Error('Unauthorized')
    }

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: user?.id,
    })

    if (!customerId) {
      throw new Error('Could not create customer')
    }

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? `http://${req.headers.host ?? 'localhost:3000'}`
        : `https://${req.headers.host ?? process.env.VITE_VERCEL_URL}`

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/account`,
      })

    if (!stripeBillingPortalSession) {
      throw new Error('Could not create billing portal session')
    }

    return { billingPortalUrl: stripeBillingPortalSession.url }
  }),
})
