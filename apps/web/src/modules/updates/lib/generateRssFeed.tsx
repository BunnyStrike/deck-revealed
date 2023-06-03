import { mkdir, writeFile } from 'fs/promises'
import * as React from 'react'
import { FeedProvider } from '../components/FeedProvider'
import * as mdxComponents from '../components/mdx'
import Content from '@/pages/index.mdx'
import { MDXProvider } from '@mdx-js/react'
import { Feed } from 'feed'
import ReactDOMServer from 'react-dom/server'

export async function generateRssFeed() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const author = {
    name: 'Joe Davola',
    email: 'crazy.joe@example.com',
  }

  const feed = new Feed({
    title: 'Commit',
    description: 'Open-source Git client for macOS minimalists',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
    },
  })

  const contentHtml = ReactDOMServer.renderToStaticMarkup(
    <FeedProvider>
      <MDXProvider components={mdxComponents as any}>
        <div>Test</div>
        <Content />
      </MDXProvider>
    </FeedProvider>
  )

  const articles = contentHtml.split(/(?<=<\/article>)\s*(?=<article)/)

  for (const article of articles) {
    const articleMatch = article?.match(/<script type="text\/metadata">(.*?)<\/script>/)
    const meta = JSON.parse(
      !!articleMatch && articleMatch?.length > 1 ? articleMatch[1] : ''
    )
    const url = `${siteUrl}/#${meta.id}`

    feed.addItem({
      title: meta.title,
      id: url,
      link: url,
      content: article,
      author: [author],
      contributor: [author],
      date: new Date(meta.date),
    })
  }

  await mkdir('./public/rss', { recursive: true })
  await writeFile('./public/rss/feed.xml', feed.rss2(), 'utf8')
}
