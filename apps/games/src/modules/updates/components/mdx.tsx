import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFeed } from './FeedProvider'
import { FormattedDate } from './FormattedDate'
import clsx from 'clsx'

export const a = Link

interface BlockquoteProps {
  children: React.ReactNode
}

export const wrapper = function Wrapper({ children }: BlockquoteProps) {
  return children
}

interface H2Props {
  children: React.ReactNode
}

export const h2 = function H2(props: H2Props) {
  const { isFeed } = useFeed()

  if (isFeed) {
    return null
  }

  return <h2 {...props} />
}

interface ImgProps {
  src: string
  alt?: string
  width?: number
  height?: number
}

export const img = function Img(props: ImgProps) {
  return (
    <div className='relative mt-8 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 [&+*]:mt-8'>
      <Image
        alt=''
        sizes='(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw'
        {...props}
      />
      <div className='pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10 dark:ring-white/10' />
    </div>
  )
}

interface ContentWrapperProps {
  className?: string
  children: React.ReactNode
}

function ContentWrapper({ className, children }: ContentWrapperProps) {
  return (
    <div className='mx-auto max-w-7xl px-6 lg:flex lg:px-8'>
      <div className='lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32'>
        <div
          className={clsx(
            'mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

interface ArticleHeaderProps {
  id: string
  date: string
}

function ArticleHeader({ id, date }: ArticleHeaderProps) {
  return (
    <header className='relative mb-10 xl:mb-0'>
      <div className='pointer-events-none absolute left-[max(-0.5rem,calc(50%-18.625rem))] top-0 z-50 flex h-4 items-center justify-end gap-x-2 lg:left-0 lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] xl:h-8'>
        <Link href={`#${id}`} className='inline-flex'>
          <FormattedDate
            date={date}
            className='xl:text-2xs/4 hidden xl:pointer-events-auto xl:block xl:font-medium xl:text-white/50'
          />
        </Link>
        <div className='h-[0.0625rem] w-3.5 bg-gray-400 lg:-mr-3.5 xl:mr-0 xl:bg-gray-300' />
      </div>
      <ContentWrapper>
        <div className='flex'>
          <Link href={`#${id}`} className='inline-flex'>
            <FormattedDate
              date={date}
              className='text-2xs/4 font-medium text-gray-500 dark:text-white/50 xl:hidden'
            />
          </Link>
        </div>
      </ContentWrapper>
    </header>
  )
}

interface ArticleProps {
  id: string
  title: string
  date: string
  children: React.ReactNode
}

export const article = function Article({ id, title, date, children }: ArticleProps) {
  const { isFeed } = useFeed()
  const heightRef = useRef<any>()
  const [heightAdjustment, setHeightAdjustment] = useState(0)

  useEffect(() => {
    const observer = new window.ResizeObserver(() => {
      if (!heightRef.current) return
      const { height } = heightRef?.current?.getBoundingClientRect()
      const nextMultipleOf8 = 8 * Math.ceil(height / 8)
      setHeightAdjustment(nextMultipleOf8 - height)
    })

    observer.observe(heightRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (isFeed) {
    return (
      <article>
        <script
          type='text/metadata'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ id, title, date }),
          }}
        />
        {children}
      </article>
    )
  }

  return (
    <article
      id={id}
      className='scroll-mt-16'
      style={{ paddingBottom: `${heightAdjustment}px` }}
    >
      <div ref={heightRef}>
        <ArticleHeader id={id} date={date} />
        <ContentWrapper className='typography'>{children}</ContentWrapper>
      </div>
    </article>
  )
}

interface CodeProps {
  highlightedCode?: string
}

export const code = function Code({ highlightedCode, ...props }: CodeProps) {
  if (highlightedCode) {
    return (
      <code {...props} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    )
  }

  return <code {...props} />
}
