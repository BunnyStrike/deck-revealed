import { Auth } from '@supabase/auth-ui-react'
import {
  ThemeSupa,
  type ViewType,
  type supabase,
} from '@supabase/auth-ui-shared'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

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
  <Auth
    supabaseClient={supabaseClient}
    theme='dark'
    redirectTo={redirectTo}
    view={view}
    appearance={{ theme: ThemeSupa }}
    providers={[]}
  />
)

export default AuthPortal
