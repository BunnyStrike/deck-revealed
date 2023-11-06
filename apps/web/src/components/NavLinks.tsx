import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@supabase/auth-helpers-react'
import { AnimatePresence, motion } from 'framer-motion'

export function NavLinks({ footer = false }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const user = useUser()

  const links = [
    ['Features', '/#features'],
    // ['Reviews', '#reviews'],
    ['Pricing', '/#pricing'],
    ['FAQs', '/#faqs'],
    footer ? ['Privacy Policy', '/privacy-policy'] : [],
  ].filter(([label]) => !!label).map(([label, href], index) => (
    <Link
      key={label}
      href={href ?? ''}
      className='relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-100 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms]'
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

  return <>{links}</>
}
