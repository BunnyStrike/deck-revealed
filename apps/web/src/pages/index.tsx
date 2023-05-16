import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { api, type RouterOutputs } from '~/utils/api'
import { CallToAction } from '~/components/CallToAction'
import ComingSoonHero from '~/components/ComingSoonHero'
import { Faqs } from '~/components/Faqs'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import { Hero } from '~/components/Hero'
import { Navbar } from '~/components/Navbar'
import { Pricing } from '~/components/Pricing'
import { PrimaryFeatures } from '~/components/PrimaryFeatures'
import { Reviews } from '~/components/Reviews'
import { SecondaryFeatures } from '~/components/SecondaryFeatures'

const Home: NextPage = () => {
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
        <ComingSoonHero />
        {/* <Hero /> */}
        {/* <PrimaryFeatures /> */}
        <SecondaryFeatures />
        <CallToAction />
        {/* <Reviews /> */}
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}

export default Home
