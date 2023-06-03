import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

import { api } from '~/utils/api'
import { Layout } from '~/modules/updates/components/Layout'
import { Intro, IntroFooter } from '../modules/updates/components/Intro'

const updates = [
  {
    title: 'New Features',
    content: "We're working on some new features that will be released soon.",
    createdAt: '2021-08-01T00:00:00.000Z',
    coverUrl: '/images/screenshot.png',
    updates: [
      "We're working on some new features that will be released soon.",
      'We are working on a new feature that will allow you to create a new account.',
      'We are working on a new feature that will allow you to create a new account.',
    ],
  },
  {
    title: 'New Features',
    content: "We're working on some new features that will be released soon.",
    createdAt: '2021-08-01T00:00:00.000Z',
    coverUrl: '/images/screenshot.png',
    updates: [
      "We're working on some new features that will be released soon.",
      'We are working on a new feature that will allow you to create a new account.',
      'We are working on a new feature that will allow you to create a new account.',
    ],
  },
  {
    title: 'New Features',
    content: "We're working on some new features that will be released soon.",
    createdAt: '2021-08-01T00:00:00.000Z',
    coverUrl: '/images/screenshot.png',
    updates: [
      "We're working on some new features that will be released soon.",
      'We are working on a new feature that will allow you to create a new account.',
      'We are working on a new feature that will allow you to create a new account.',
    ],
  },
  {
    title: 'New Features',
    content: "We're working on some new features that will be released soon.",
    createdAt: '2021-08-01T00:00:00.000Z',
    coverUrl: '/images/screenshot.png',
    updates: [
      "We're working on some new features that will be released soon.",
      'We are working on a new feature that will allow you to create a new account.',
      'We are working on a new feature that will allow you to create a new account.',
    ],
  },
  {
    title: 'New Features',
    content: "We're working on some new features that will be released soon.",
    createdAt: '2021-08-01T00:00:00.000Z',
    coverUrl: '/images/screenshot.png',
    updates: [
      "We're working on some new features that will be released soon.",
      'We are working on a new feature that will allow you to create a new account.',
      'We are working on a new feature that will allow you to create a new account.',
    ],
  },
]

const UpdateItem = ({
  title,
  content,
  coverUrl,
  updates = [],
  createdAt,
}: any) => {
  return (
    <div>
      <article className='relative mb-12 first-letter:scroll-mt-16'>
        <header className=' mb-6 mt-10 flex flex-col lg:mb-0'>
          <div className='pointer-events-none absolute left-[max(-0.5rem,calc(60%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:-left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8'>
            <div className=' flex flex-row-reverse items-center justify-end gap-2 lg:flex-row'>
              <time className='text-xs text-gray-500'>
                {dayjs(createdAt).format('MMM D, YYYY')}
              </time>
              <div className='h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300'></div>
            </div>
          </div>
        </header>
        <div className='mx-auto max-w-7xl px-6 lg:flex lg:px-8'>
          <div className='sm:pl-[20%] lg:flex lg:w-full lg:justify-end lg:pl-[52%] '>
            <div className=''>
              {coverUrl && (
                <div className='relative mt-8 h-auto w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 [&+*]:mt-8'>
                  <Image
                    src={coverUrl}
                    width={800}
                    height={500}
                    style={{ objectFit: 'cover' }}
                    alt={title}
                  />
                </div>
              )}
              <h2 className='text-lg font-semibold text-gray-200'>{title}</h2>
              <p className='mb-6 mt-3 text-sm text-gray-400'>{content}</p>
              <h3 className='text-sm font-semibold text-gray-200'>
                What&apos;s New
              </h3>
              <ul className='ml-6 list-disc'>
                {updates.map((update: any, index: number) => (
                  <li key={index} className='mt-2 text-sm'>
                    {update}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default function UpdatesPage() {
  // const { data: updates = [] } = api.update.all.useQuery()
  return (
    <Layout
      intro={
        <Intro
          title='DevEngage'
          titleFocus='All The Updates Here'
          description='Check out what is new here including new templates, courses, and projects. Enter your email address to get notified when we release new updates.'
        />
      }
      introFooter={<IntroFooter />}
    >
      <div className='relative flex h-full w-full flex-col items-center justify-center'>
        {/* <h1 className='absolute left-1/2 text-center text-4xl font-bold text-white'>
          Coming soon...
        </h1> */}
        {updates.map((update, index) => (
          <UpdateItem key={index} {...update} />
        ))}
      </div>
    </Layout>
  )
}
