import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

export function NavLinksWithUser({ footer = false }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const user = useUser()
  const router = useRouter()

  // useEffect(() => {
  // }, [router.query])

  const links = [
    ['Overview', '/account?tab=overview'],
    // ['Reviews', '#reviews'],
    ['Billing', '/account?tab=billing'],

    ['Updates', '/updates'],
    // ['FAQs', '/#faqs'],
  ]

  if (user?.app_metadata?.role === 'ADMIN') {
    links.push(['Admin', '/account?tab=admin'])
  }

  const linksBuilt = links.map(([label, href], index) => (
    <Link
      key={label}
      href={href ?? ''}
      className={clsx(
        router.query?.tab === label?.toLowerCase() ? 'bg-primary' : '',
        `relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-100 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]`
      )}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className='absolute inset-0 rounded-lg bg-gray-100'
            layoutId='hoverBackground'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <span className='relative z-10'>{label}</span>
    </Link>
  ))

  return <>{linksBuilt}</>
}
