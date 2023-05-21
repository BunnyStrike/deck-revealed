import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'

import { Button, FormFieldset } from '@revealed/ui'

import { api } from '~/utils/api'
import { Container } from '~/components/Container'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { StripePricingTable } from '~/components/StripePricingTable'
import AdminScreen from '~/components/admin/AdminScreen'
import { supabaseClientGlobal } from './_app'

export default function AccountPage() {
  const [currentTab, setCurrentTab] = useState(0)
  const router = useRouter()
  const user = useUser()
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation()

  const { data: subscriptionStatus } = api.user.subscriptionStatus.useQuery()

  const secondaryNavigation = [{ name: 'Overview' }, { name: 'Billing' }]

  if (user?.app_metadata?.role === 'ADMIN') {
    secondaryNavigation.push({
      name: 'Admin',
    })
  }

  useEffect(() => {
    router.query.tab === 'billing' && setCurrentTab(1)
  }, [router.query])

  // const handleCheckout = async () => {
  //   const res = await createCheckoutSession()
  //   console.log(res)
  // }

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
          <h1 className='leading-1 p-2 text-lg font-semibold text-gray-400'>
            Account
          </h1>

          <header>
            <nav className='flex overflow-x-auto border-b border-t border-white/10 py-4'>
              <ul
                role='list'
                className='flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8'
              >
                {secondaryNavigation.map((item, index) => (
                  <li key={item.name}>
                    <button
                      onClick={() => setCurrentTab(index)}
                      className={currentTab === index ? 'text-primary' : ''}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          {/* <AdminScreen className='h-full bg-black' /> */}

          {currentTab === 0 && (
            <div className='mt-4'>
              <Link href='/change-password' className='btn-secondary btn'>
                Change Password
              </Link>
              <Button
                onClick={() => supabaseClientGlobal.auth.signOut()}
                className='btn-ghost btn'
              >
                Sign Out
              </Button>
            </div>
          )}

          {currentTab === 1 && (
            <div className='mt-4'>
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
            </div>
          )}

          {currentTab === 2 && (
            <div className='mt-4'>
              <AdminScreen className='h-full bg-black' />
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}
