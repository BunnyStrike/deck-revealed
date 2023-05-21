import Stripe from 'stripe'

// import { env } from "~/env.mjs";
console.log('NEXT_PUBLIC_STRIPE_SK', process.env.NEXT_PUBLIC_STRIPE_SK)
export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SK ?? '', {
  apiVersion: '2022-11-15',
})
