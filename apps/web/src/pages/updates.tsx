import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'

import { Button, FormInputField } from '@revealed/ui'

import { api, type RouterOutputs } from '~/utils/api'
import { CallToAction } from '~/components/CallToAction'
import ComingSoonHero from '~/components/ComingSoonHero'
import { Container } from '~/components/Container'
import { Faqs } from '~/components/Faqs'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { Hero } from '~/components/Hero'
import { Navbar } from '~/components/Navbar'
import { Pricing } from '~/components/Pricing'
import { PrimaryFeatures } from '~/components/PrimaryFeatures'
import { Reviews } from '~/components/Reviews'
import { SecondaryFeatures } from '~/components/SecondaryFeatures'

const updates = [
  {
    title: 'Revealed is now in beta!',
    content: 'We are now accepting beta testers. Sign up to be notified.',
    date: 'August 1, 2021',
  },
  {
    title: 'Revealed is now in beta!',
    content: 'We are now accepting beta testers. Sign up to be notified.',
    date: 'August 1, 2021',
  },
]

const Home: NextPage = () => {
  const user = useUser()
  const isAdmin = user?.app_metadata?.role === 'ADMIN'

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
      <main>
        <Container className='relative my-10'>
          <h2 className='leading-2 text-center text-4xl text-white'>Updates</h2>
          <p className='text-center text-xl'>
            All the lastest Reavealed news, delivered to you
          </p>

          <div className='w-100 flex flex-col justify-center '>
            <div className=' flex h-20 w-[300px] items-center justify-center gap-2 self-center'>
              <FormInputField placeholder='Subscribe via email' />
              <Button className='btn-sm mt-2'>Subscribe</Button>
            </div>

            {!isAdmin && (
              <div className=' flex h-40 w-[300px] flex-col items-center justify-center gap-2 self-center '>
                <textarea />

                <Button className='btn-sm mt-2'>Post</Button>
              </div>
            )}
          </div>

          <div className='p-5'>
            {updates.map((update) => (
              <div className='mb-3 overflow-hidden bg-gray-200 shadow sm:rounded-lg'>
                <div className='px-4 py-5 sm:px-6'>
                  <h3 className='text-lg font-medium leading-6 text-gray-900'>
                    {update.title}
                  </h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-700'>
                    {update.content}
                  </p>

                  <p className='mt-1 max-w-2xl text-sm text-gray-700'>
                    {update.date}
                  </p>
                  {/* <div className='flex justify-end text-gray-700'>
                    <button>Read More</button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default Home
