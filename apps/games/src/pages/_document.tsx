import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className='h-full bg-gray-900 antialiased' lang='en'>
      <Head>
        <script async src='https://js.stripe.com/v3/pricing-table.js'></script>
      </Head>
      <body className='flex h-full flex-col'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
