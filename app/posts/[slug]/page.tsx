import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { TableOfContents } from '@/components/table-of-contents'
import { Footer } from '@/components/footer'
import { ThemeToggle } from '@/components/theme-toggle'

interface PostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: `${post.title} | 刘贺同学`,
    description: post.excerpt,
    keywords: post.tags,
  }
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const sourceLabels: Record<string, { text: string; emoji: string; color: string }> = {
    feishu: { text: '飞书', emoji: '☁️', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    wechat: { text: '公众号', emoji: '💬', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    github: { text: 'GitHub', emoji: '🐙', color: 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' },
    openclaw: { text: 'OpenClaw', emoji: '🤖', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  }

  const sourceInfo = sourceLabels[post.source] || sourceLabels.github

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: '刘贺同学',
      url: 'https://liuhedev.github.io',
    },
    publisher: {
      '@type': 'Person',
      name: '刘贺同学',
    },
    url: `https://liuhedev.github.io/posts/${params.slug}`,
    keywords: post.tags?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Top Navigation */}
      <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/avatar.jpg"
            alt="刘贺"
            width={40}
            height={40}
            className="rounded-full"
          />
        </Link>
        <ThemeToggle />
      </div>

      <main className="min-h-screen pt-24">
        <article className="container-custom py-12">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-secondary dark:text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 text-balance">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary dark:text-secondary-dark mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} 分钟阅读</span>
              </div>

              <span className={`text-xs px-2 py-1 rounded-full ${sourceInfo.color}`}>
                {sourceInfo.emoji} {sourceInfo.text}
              </span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-secondary dark:text-secondary-dark" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content + TOC */}
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-full ml-8 top-0 w-56">
              <TableOfContents content={post.content} />
            </div>
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Footer Actions */}
          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-secondary dark:text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页查看更多文章
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
