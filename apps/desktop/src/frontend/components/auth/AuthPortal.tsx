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
  <div className='bg-gray-900'>
    <Auth
      supabaseClient={supabaseClient}
      // theme='dark'
      redirectTo={redirectTo}
      view={view}
      appearance={{
        className: { container: 'bg-gray-900' },
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#BA40D5',
              brandAccent: '#663DBC',
              inputText: '#ffffff',
            },
          },
        },
      }}
      providers={[]}
    />
    <div className='p-2'>
      <i>By Signing Up you agree that you are 13 years or older</i>
    </div>
    <hr />
    <div className='p-2 text-center'>
      <a href='https://www.appsrevealed.com/privacy-policy' target='_blank'>
        Privacy Policy
      </a>{' '}
      |{' '}
      <a href='https://www.appsrevealed.com/privacy-policy' target='_blank'>
        Terms & Service
      </a>
    </div>
  </div>
)

export default AuthPortal
