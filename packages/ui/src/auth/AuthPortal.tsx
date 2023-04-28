import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa, type supabase } from '@supabase/auth-ui-shared'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// const supabase = createClient(
//   getEnvVar('SUPABASE_URL'),
//   getEnvVar('SUPABASE_API_SECRET_KEY')
// )

interface AuthPortalProps {
  supabaseClient: SupabaseClient
}

export const AuthPortal = ({ supabaseClient }: AuthPortalProps) => (
  <Auth
    supabaseClient={supabaseClient}
    theme='dark'
    appearance={{ theme: ThemeSupa }}
    providers={[]}
  />
)

export default AuthPortal
