import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

import { Button, FormInputField } from '@revealed/ui'

import { api } from '~/utils/api'

export function ComingSoonHero() {
  const { mutateAsync: subscribeToNewsletter } =
    api.subscribeToNewsletter.create.useMutation()

  const handleSubscribe = async (event: {
    currentTarget: HTMLFormElement | undefined
    preventDefault: () => void
  }) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))

    if (!data?.email) return alert('Please fill out all fields')

    const subscribeToNewsletterData = {
      email: data?.email ?? 'Untitled',
    }

    await subscribeToNewsletter(subscribeToNewsletterData as any)

    event.currentTarget?.reset()
    alert('Subscribed!')
  }

  return (
    <div className='relative isolate overflow-hidden bg-gray-900'>
      <svg
        className='absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
        aria-hidden='true'
      >
        <defs>
          <pattern
            id='983e3e4c-de6d-4c3f-8d64-b9761d1534cc'
            width={200}
            height={200}
            x='50%'
            y={-1}
            patternUnits='userSpaceOnUse'
          >
            <path d='M.5 200V.5H200' fill='none' />
          </pattern>
        </defs>
        <svg x='50%' y={-1} className='overflow-visible fill-gray-800/20'>
          <path
            d='M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z'
            strokeWidth={0}
          />
        </svg>
        <rect
          width='100%'
          height='100%'
          strokeWidth={0}
          fill='url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)'
        />
      </svg>
      <div
        className='absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]'
        aria-hidden='true'
      >
        <div
          className='aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20'
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
        />
      </div>
      <div className='mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40'>
        <div className='mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8'>
          {/* <Image
            className='h-11'
            width={44}
            height={44}
            src='/images/logo.png'
            alt='Your Company'
          /> */}
          <div className='mt-24 sm:mt-32 lg:mt-16'>
            <a href='#' className='inline-flex space-x-6'>
              <span className='rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20'>
                New Beta Coming Soon
              </span>
              <span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300'>
                <span>Shipping v2.0</span>
                <ChevronRightIcon
                  className='h-5 w-5 text-gray-500'
                  aria-hidden='true'
                />
              </span>
            </a>
          </div>
          <h1 className='mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl'>
            Take Control Of Your Gaming Experience.
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-300'>
            The all-in-one tool for your Steam Deck, PC, ROG Ally, and more.
            Enjoy and manage your favorite apps, games, mods, retros, and more.
            Sign up to start the journey.
          </p>

          {/* <div className='mt-10 flex items-center gap-x-6'>
            <Link href='/register' className='btn-primary btn-lg btn'>
              Sign Up
            </Link>
            <a
              href='#features'
              className='text-sm font-semibold leading-6 text-white'
            >
              Learn more <span aria-hidden='true'>→</span>
            </a>
          </div> */}

          <div className='w-100 mt-8 flex items-center self-center'>
            <form onSubmit={handleSubscribe} className='flex w-[300px] gap-2'>
              <FormInputField
                placeholder='Subscribe for updates'
                fieldName='email'
              />
              <Button className='btn-sm mt-2.5'>Subscribe</Button>
            </form>
          </div>
        </div>
        <div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32'>
          <div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
            <Image
              src='/images/apps-screenshot.png'
              alt='App screenshot'
              width={2432}
              height={1442}
              className='w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonHero
