import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
// import getRawBody from 'raw-body'
import type Stripe from 'stripe'

import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
  stripe,
} from '@revealed/api'
import { prisma } from '@revealed/db'

import { env } from '~/env.mjs'

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

const webhookSecret = env.STRIPE_WEBHOOK_SECRET

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    // const buf = await getRawBody(req)
    const signature = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        signature?.toString() ?? '',
        webhookSecret
      )

      // Handle the event
      switch (event.type) {
        case 'invoice.paid':
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
          await handleInvoicePaid({
            event,
            stripe,
            prisma,
          })
          break
        case 'customer.subscription.created':
          // Used to provision services as they are added to a subscription.
          await handleSubscriptionCreatedOrUpdated({
            event,
            prisma,
          })
          break
        case 'customer.subscription.updated':
          // Used to provision services as they are updated.
          await handleSubscriptionCreatedOrUpdated({
            event,
            prisma,
          })
          break
        case 'invoice.payment_failed':
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic
          break
        case 'customer.subscription.deleted':
          // handle subscription cancelled automatically based
          // upon your subscription settings.
          await handleSubscriptionCanceled({
            event,
            prisma,
          })
          break
        default:
        // Unexpected event type
      }

      // record the event in the database
      await prisma.stripeEvent.create({
        data: {
          id: event.id,
          type: event.type,
          object: event.object,
          api_version: event.api_version,
          account: event.account,
          created: new Date(event.created * 1000), // convert to milliseconds
          data: {
            object: event.data.object,
            previous_attributes: event.data.previous_attributes,
          },
          livemode: event.livemode,
          pending_webhooks: event.pending_webhooks,
          request: {
            id: event.request?.id,
            idempotency_key: event.request?.idempotency_key,
          },
        },
      })

      res.json({ received: true })
    } catch (err) {
      res.status(400).send(err)
      return
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
