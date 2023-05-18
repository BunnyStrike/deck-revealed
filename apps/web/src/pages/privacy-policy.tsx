import Head from 'next/head'

import { PrivacyPolicyPage } from '@revealed/ui'

import { Container } from '~/components/Container'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <Header />
      <Container className='bg-gray-200 p-2 text-black'>
        <PrivacyPolicyPage />
      </Container>
      <Footer />
    </>
  )
}
