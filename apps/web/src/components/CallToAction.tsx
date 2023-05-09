import { AppStoreLink } from '~/components/AppStoreLink'
import { CircleBackground } from '~/components/CircleBackground'
import { Container } from '~/components/Container'

export function CallToAction() {
  return (
    <section
      id='get-free-shares-today'
      className='relative overflow-hidden bg-gray-900 py-20 sm:py-28'
    >
      <div className='absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2'>
        <CircleBackground color='#fff' className='animate-spin-slower' />
      </div>
      <Container className='relative'>
        <div className='mx-auto max-w-md sm:text-center'>
          <h2 className='text-3xl font-medium tracking-tight text-white sm:text-4xl'>
            Check it out for free
          </h2>
          <p className='mt-4 text-lg text-gray-300'>
            It only takes 30 seconds to download the app, sign up, and start
            upgrading your deck.
          </p>
          <div className='mb-4 mt-8 flex justify-center'>
            <a
              href='https://www.deckrevealed.com/content/files/2023/02/DeckRevealed-1.desktop'
              target='_blank'
              className='btn-primary btn'
            >
              Download Steam Deck Version
            </a>

            {/* <AppStoreLink color='white' /> */}
          </div>
          <i>
            Don't forget to copy the installer to your Desktop, or it won't
            work.
          </i>
        </div>
      </Container>
    </section>
  )
}
