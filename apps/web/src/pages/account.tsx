import Head from 'next/head'
import Link from 'next/link'

import { AdminScreen, Button, FormFieldset } from '@revealed/ui'

import { api } from '~/utils/api'
import { Container } from '~/components/Container'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { StripePricingTable } from '~/components/StripePricingTable'
import { supabaseClientGlobal } from './_app'

const secondaryNavigation = [
  { name: 'Overview', href: '#', current: true },
  { name: 'Activity', href: '#', current: false },
  { name: 'Settings', href: '#', current: false },
  { name: 'Collaborators', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
]

export default function AccountPage() {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation()

  const { data: subscriptionStatus } = api.user.subscriptionStatus.useQuery()

  console.log(subscriptionStatus)

  const is = true

  const handleCheckout = async () => {
    const res = await createCheckoutSession()
    console.log(res)
  }

  return (
    <>
      <Head>
        <title>Revealed</title>
        <meta
          name='description'
          content='The all-in-one tool for your Steam Deck. Enjoy your favorite apps, manage your games, launch Game Mode. Sign up to be notified soon.'
        />
      </Head>
      <Header />
      <main className='h-full'>
        <Container>
          <h1 className='leading-1 text-lg font-semibold text-gray-400'>
            Account Billing
          </h1>
          {/* <div>
          <p>Coming soon</p>
        </div>
        <Button onClick={() => createCheckoutSession()}>Checkout</Button> */}
          {/* <FormFieldset
          title='Account'
          className='p-8'
          list={[
            {
              name: 'Free',
              value: '',
              details: 'Your email address is used to log in to your account.',
            },
            {
              name: 'Pro',
              value: '',
              details: 'Your password must be at least 8 characters long.',
            },
            {
              name: 'Pro Plus',
              value: '',
              details: 'Your password must be at least 8 characters long.',
            },
          ]}
        /> */}
          {/* <header>
          <nav className='flex overflow-x-auto border-b border-t border-white/10 py-4'>
            <ul
              role='list'
              className='flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8'
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={item.current ? 'text-indigo-400' : ''}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header> */}
          {/* <AdminScreen className='h-full bg-black' /> */}

          <p>Upgrade your plan today!</p>

          {!!subscriptionStatus ? (
            <a
              href='https://billing.stripe.com/p/login/dR68yGedMc7R6cw8ww'
              target='_blank'
              className='btn-primary btn'
            >
              Manage Billing
            </a>
          ) : (
            <StripePricingTable />
          )}
          <div className='mt-4'></div>
          <Link href='/change-password' className='btn-secondary btn'>
            Change Password
          </Link>
          <Button
            onClick={() => supabaseClientGlobal.auth.signOut()}
            className='btn-ghost btn'
          >
            Sign Out
          </Button>
        </Container>
      </main>
      <Footer />
    </>
  )
}
