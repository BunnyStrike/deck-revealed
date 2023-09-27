import * as React from 'react'
import { useUser } from '@supabase/auth-helpers-react'

import { env } from '~/env.mjs'

export const StripePricingTable = () => {
  const user = useUser()

  return <p>temp</p>
}
