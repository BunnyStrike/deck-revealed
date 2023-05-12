import { getOrCreateStripeCustomerIdForUser } from '../stripe/stripe-webhook-handlers'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
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

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user?.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID ?? '',
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkoutSuccess=true`,
      cancel_url: `${baseUrl}/dashboard?checkoutCanceled=true`,
      subscription_data: {
        metadata: {
          userId: user?.id,
        },
      },
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
        return_url: `${baseUrl}/dashboard`,
      })

    if (!stripeBillingPortalSession) {
      throw new Error('Could not create billing portal session')
    }

    return { billingPortalUrl: stripeBillingPortalSession.url }
  }),
})
