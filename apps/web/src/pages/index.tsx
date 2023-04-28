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
        <title>Pocket - Invest at the perfect time.</title>
        <meta
          name='description'
          content='By leveraging insights from our network of industry insiders, you’ll know exactly when to buy to maximize profit, and exactly when to sell to avoid painful losses.'
        />
      </Head>
      {/* <Header /> */}
      <main>
        <ComingSoonHero />
        {/* <Hero /> */}
        {/* <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Reviews />
        <Pricing />
        <Faqs /> */}
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default Home
