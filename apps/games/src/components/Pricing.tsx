import { useState } from 'react'
import { useRouter } from 'next/router'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'

import { api, type ProductOutput } from '~/utils/api'
import { Button } from '~/components/Button'
import { Container } from '~/components/Container'
import { Logomark } from '~/components/Logo'

const plans = [
  {
    name: 'Free',
    featured: false,
    price: { Monthly: '$0', Annually: '$0' },
    description: 'Get started for free.',
    button: {
      label: 'Get started for free',
      href: '/register',
    },
    features: [
      'Access to apps',
      'Download and install',
      'Favorites',
      'Ad-Supported',
    ],
    logomarkClassName: 'fill-gray-300',
  },
  {
    name: 'Pro',
    featured: false,
    price: { Monthly: '$6 Once', Annually: '$7' },
    description: 'Unlock more features',
    button: {
      label: 'Unlock',
      href: '/register',
    },
    features: [
      'Add Custom Apps, Games, etc.',
      'Add Custom Art (coming)',
      'Minor Syncing via Steam, etc. (coming)',
      'Themes',
      'Launcher Support',
      'Ability to Remove Ads',
      'Limited-Support',
      // 'Easy Modding',
    ],
    logomarkClassName: 'fill-gray-500',
  },
  {
    name: 'Pro Plus',
    featured: true,
    price: { Monthly: '$10 Monthly', Annually: '$100' },
    description: 'Subscribe to everything',
    button: {
      label: 'Subscribe',
      href: '/register',
    },
    features: [
      'Everything in Pro',
      'Full Syncing Saves, Games, Mods, More (coming)',
      'Feature Previews',
      'VIP Voting',
      'Full-Support',
      'Faster Downloads',
    ],
    logomarkClassName: 'fill-primary',
  },
]

function CheckIcon(props: any) {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' {...props}>
      <path
        d='M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z'
        fill='currentColor'
      />
      <circle
        cx='12'
        cy='12'
        r='8.25'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

interface PlanProps {
  // name: string
  // price: number
  // description: string
  // // button: { label: string; href: string }
  // features: string[]
  // featured?: boolean
  // activePeriod: string // 'Monthly' | 'Annually'
  // logomarkClassName: string
  signUpFirst?: boolean
  plan: ProductOutput
}

function Plan({
  // name,
  // price,
  // description,
  // // button,
  // features,
  // featured = false,
  // activePeriod,
  // logomarkClassName,
  signUpFirst = false,
  plan,
}: PlanProps) {
  const {
    id,
    priceId,
    name,
    description,
    price,
    features,
    interval,
    isFeatured: featured,
  } = plan
  let buttonLabel = 'Get Started'
  let logomarkClassName = 'fill-gray-300'
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation()
  const { data: subscriptions = [] } = api.product.subscriptions.useQuery()
  const router = useRouter()

  const dollarUS = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const redirectToCustomerPortal = async () => {
    if (signUpFirst) return await router.push('/register')
    const { checkoutUrl } = await createCheckoutSession({
      priceId,
      mode: interval === 'OneTime' ? 'payment' : undefined,
    })
    if (checkoutUrl) {
      window.location.assign(checkoutUrl)
    }
  }

  if (price > 0 && interval === 'OneTime') {
    buttonLabel = 'Unlock'
    logomarkClassName = 'fill-gray-500'
  } else if (price > 0 && (interval === 'Monthly' || interval === 'Yearly')) {
    buttonLabel = 'Subscribe'
    logomarkClassName = 'fill-primary'
  }

  return (
    <section
      className={clsx(
        'flex flex-col overflow-hidden rounded-3xl p-6 shadow-lg shadow-gray-900/5',
        featured ? 'order-first bg-gray-900 lg:order-none' : 'bg-white'
      )}
    >
      <h3
        className={clsx(
          'flex items-center text-sm font-semibold',
          featured ? 'text-white' : 'text-gray-900'
        )}
      >
        <Logomark className={clsx('h-6 w-6 flex-none', logomarkClassName)} />
        <span className='ml-4'>{name}</span>
      </h3>
      <p
        className={clsx(
          'relative mt-5 flex text-3xl tracking-tight',
          featured ? 'text-white' : 'text-gray-900'
        )}
      >
        {dollarUS.format(price / 100)}
      </p>
      <p
        className={clsx(
          'mt-3 text-sm',
          featured ? 'text-gray-300' : 'text-gray-700'
        )}
      >
        {description}
      </p>
      <div className='order-last mt-6'>
        <ul
          role='list'
          className={clsx(
            '-my-2 divide-y text-sm',
            featured
              ? 'divide-gray-800 text-gray-300'
              : 'divide-gray-200 text-gray-700'
          )}
        >
          {features.map((feature) => (
            <li key={feature} className='flex py-2'>
              <CheckIcon
                className={clsx(
                  'h-6 w-6 flex-none',
                  featured ? 'text-white' : 'text-primary'
                )}
              />
              <span className='ml-4'>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        onClick={() => void redirectToCustomerPortal()}
        color={featured ? 'primary' : 'gray'}
        className='mt-6'
        aria-label={`Get started with the ${name} plan for ${price}`}
      >
        {buttonLabel}
      </Button>
    </section>
  )
}

export function Pricing({
  hideMarketing = false,
}: {
  hideMarketing?: boolean
}) {
  const [activePeriod, setActivePeriod] = useState('Monthly')
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation()
  const { data: subscriptions = [] } = api.product.subscriptions.useQuery()

  console.log(subscriptions)

  const redirectToCustomerPortal = async () => {
    const { checkoutUrl } = await createCheckoutSession({
      priceId: 'price_1NAIjbE527sTmukyO0NLM0Ab',
      // mode: 'payment',
    })
    // 10/m - price_1NAIjbE527sTmukyO0NLM0Ab
    // 100/y - price_1NAIjbE527sTmukyAXlVvbZm

    if (checkoutUrl) {
      window.location.assign(checkoutUrl)
    }
  }

  return (
    <section
      id='pricing'
      aria-labelledby='pricing-title'
      className='border-t border-gray-200 bg-gray-300 py-20 sm:py-32'
    >
      <Container>
        {!hideMarketing && (
          <div className='mx-auto max-w-2xl text-center'>
            <h2
              id='pricing-title'
              className='text-3xl font-medium tracking-tight text-gray-900'
            >
              Start Free. Upgrade Anytime.
            </h2>
            <p className='mt-2 text-lg text-gray-600'>
              You will find joy at any level, but the Pro Plus options give you
              everything.
            </p>
          </div>
        )}

        <div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-10 sm:mt-20 lg:max-w-none lg:grid-cols-3'>
          {subscriptions.map((plan) => (
            <Plan key={plan.name} signUpFirst={!hideMarketing} plan={plan} />
          ))}
        </div>
      </Container>
    </section>
  )
}
