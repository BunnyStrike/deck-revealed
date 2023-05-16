import Link from 'next/link'

import { Container } from '~/components/Container'

const faqs = [
  [
    {
      question: 'How do I install the app?',
      answer: `Download the app's installer (DeckRevealed.desktop) to your desktop and double-click the desktop installer, and it will start the process, which will take about 30 seconds to finish. If it is successful, the app will auto-launch.`,
    },

    {
      question: 'How do I enable paid account support?',
      answer:
        'Create your Deck Revealed app account with the same email you chose to signup for one of our supported memberships. Linking an additional email will be kept in the near future.',
    },
  ],
  [
    {
      question: `Why can't I login to the Deck Revealed app?`,
      answer: `You could either already have an account or need to create a new account. If you have an account already, and it won't let you reset the password or login, then you will need to email us at support@deckrevealed.com to remove the account so you can create a new one. If you created an account on Patreon or deckrevealed.com, we do not automatically create an account for you, and you will have to create an account by signing up with, preferably, the email you used on the other service. We plan to improve this process in the future.`,
    },
  ],
  [
    {
      question: 'Is Deck Revealed open-source?',
      answer: `The app is not open-source at this time. We do plan on making it, or most of it, open-source in the future. `,
    },
  ],
]

export function Faqs() {
  return (
    <section
      id='faqs'
      aria-labelledby='faqs-title'
      className='border-t border-gray-800 py-20 sm:py-32'
    >
      <Container>
        <div className='mx-auto max-w-2xl lg:mx-0'>
          <h2
            id='faqs-title'
            className='text-3xl font-medium tracking-tight text-gray-100'
          >
            Frequently asked questions
          </h2>
          <p className='mt-2 text-lg text-gray-200'>
            If you have anything else you want to ask,{' '}
            <Link
              href='mailto:support@gamesrevealed.com'
              className='text-gray-100 underline'
            >
              reach out to us
            </Link>
            .
          </p>
        </div>
        <ul
          role='list'
          className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3'
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role='list' className='space-y-10'>
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className='text-lg font-semibold leading-6 text-gray-100'>
                      {faq.question}
                    </h3>
                    <p className='mt-4 text-sm text-gray-200'>{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
