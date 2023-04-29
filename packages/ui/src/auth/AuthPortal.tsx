import { Auth } from '@supabase/auth-ui-react'
import {
  ThemeSupa,
  type ViewType,
  type supabase,
} from '@supabase/auth-ui-shared'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { AuthLayout } from './AuthLayout'

// const supabase = createClient(
//   getEnvVar('SUPABASE_URL'),
//   getEnvVar('SUPABASE_API_SECRET_KEY')
// )

interface AuthPortalProps {
  supabaseClient: SupabaseClient
  redirectTo?: string
  view?: ViewType
}

export const AuthPortal = ({
  supabaseClient,
  redirectTo = '/',
  view = 'sign_up',
}: AuthPortalProps) => (
  <AuthLayout>
    <Auth
      supabaseClient={supabaseClient}
      theme='dark'
      redirectTo={redirectTo}
      view={view}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
    />
    <i>By Signing Up you agree that you are 13 years or older</i>
  </AuthLayout>
)

export default AuthPortal
