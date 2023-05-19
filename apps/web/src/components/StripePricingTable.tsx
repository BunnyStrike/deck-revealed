import * as React from 'react'
import { useUser } from '@supabase/auth-helpers-react'

import { env } from '~/env.mjs'

export const StripePricingTable = () => {
  const user = useUser()

  return (
    <stripe-pricing-table
      pricing-table-id={env.NEXT_PUBLIC_STRIPE_PRICE_TABLE_ID}
      publishable-key={env.NEXT_PUBLIC_STRIPE_PU}
      client-reference-id={user?.id}
      customer-email={user?.email}
    ></stripe-pricing-table>
  )
}
