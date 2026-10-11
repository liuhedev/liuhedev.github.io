import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { TableOfContents } from '@/components/table-of-contents'
import { Footer } from '@/components/footer'
import { SiteHeader } from '@/components/site-header'

interface PostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: '文章未找到' }
  return { title: post.title, description: post.excerpt, keywords: post.tags }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const dateName = post.dateType === 'written' ? '写作日期' : '发布日期'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    ...(post.dateType === 'published' ? { datePublished: post.date } : { dateCreated: post.date }),
    author: { '@type': 'Person', name: '刘贺', url: 'https://liuhe.abloomvole8.chatgpt.site' },
    publisher: { '@type': 'Person', name: '刘贺' },
    url: `https://liuhedev.github.io/posts/${params.slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <main>
        <article className="container-page py-10 sm:py-14 lg:py-20">
          <Link href="/#articles" className="back-link"><ArrowLeft size={16} />全部文章</Link>
          <header className="article-header">
            <div className="meta mb-5 flex flex-wrap gap-x-4 gap-y-2">
              <span>{dateName}</span>
              <time dateTime={post.date}>{post.date}</time>
              {post.readingTime ? <span>{post.readingTime} 分钟阅读</span> : null}
            </div>
            <h1 className="max-w-5xl text-4xl font-medium leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">{post.title}</h1>
            {post.excerpt ? <p className="mt-6 max-w-3xl text-base leading-8 text-ink-soft sm:text-lg">{post.excerpt}</p> : null}
            {post.tags.length ? (
              <ul className="mt-7 flex flex-wrap gap-2" aria-label="文章标签">
                {post.tags.map((tag) => <li key={tag} className="article-tag">{tag}</li>)}
              </ul>
            ) : null}
          </header>
          <div className="article-layout">
            <div className="article-content"><MarkdownRenderer content={post.content} /></div>
            <TableOfContents content={post.content} />
          </div>
          <div className="mx-auto mt-16 max-w-[760px] border-t border-rule-soft pt-8">
            <Link href="/#articles" className="back-link"><ArrowLeft size={16} />返回文章列表</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
