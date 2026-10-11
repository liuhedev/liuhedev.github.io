'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import type { PostMetadata } from '@/types/post'

const pageSize = 10

function dateLabel(type: PostMetadata['dateType']) {
  return type === 'written' ? '写作日期' : '发布日期'
}

export function IndexBoard({ posts }: { posts: PostMetadata[] }) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('zh-CN')
    if (!needle) return posts
    return posts.filter((post) =>
      `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLocaleLowerCase('zh-CN').includes(needle),
    )
  }, [posts, query])
  const visiblePosts = filtered.slice(0, visibleCount)

  const years = useMemo(() => {
    const counts = new Map<string, number>()
    for (const post of posts) counts.set(post.date.slice(0, 4), (counts.get(post.date.slice(0, 4)) || 0) + 1)
    return [...counts.entries()]
  }, [posts])

  return (
    <section className="container-page py-12 sm:py-16" id="articles">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <div className="mb-6 flex flex-col gap-4 border-b border-rule pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="meta mb-2">Notebook</p>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">全部文章</h2>
            </div>
            <label className="search-field">
              <Search aria-hidden size={16} />
              <span className="sr-only">搜索文章</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setVisibleCount(pageSize)
                }}
                placeholder="搜索标题、摘要或标签"
              />
            </label>
          </div>

          {filtered.length ? (
            <ol className="divide-y divide-rule-soft">
              {visiblePosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/posts/${post.slug}`} className="article-row group">
                    <div className="min-w-0">
                      <div className="meta mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{dateLabel(post.dateType)}</span>
                        <time dateTime={post.date}>{post.date}</time>
                        {post.readingTime ? <span>{post.readingTime} 分钟</span> : null}
                      </div>
                      <h3 className="text-xl font-medium leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
                        {post.title}
                      </h3>
                      {post.excerpt ? <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-ink-soft sm:text-base">{post.excerpt}</p> : null}
                    </div>
                    <ArrowUpRight aria-hidden className="mt-1 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" size={20} />
                  </Link>
                </li>
              ))}
              {visibleCount < filtered.length ? (
                <li className="pt-6">
                  <button
                    className="w-full border border-rule px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent sm:w-auto"
                    type="button"
                    onClick={() => setVisibleCount((count) => count + pageSize)}
                  >
                    查看更多（已显示 {visiblePosts.length} / {filtered.length}）
                  </button>
                </li>
              ) : null}
            </ol>
          ) : (
            <p className="py-16 text-center text-muted">没有找到匹配的文章。</p>
          )}
        </div>

        <aside className="space-y-8 lg:border-l lg:border-rule-soft lg:pl-8">
          <div>
            <p className="meta mb-4">Archive</p>
            <ul className="space-y-2">
              {years.map(([year, count]) => (
                <li key={year} className="flex items-baseline justify-between border-b border-rule-soft py-2">
                  <span className="font-mono text-sm">{year}</span>
                  <span className="meta">{count} 篇</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-rule-soft pt-6 text-sm leading-7 text-ink-soft">
            <p className="meta mb-3">About</p>
            <p>十年全栈与支付系统实践，现在持续记录 AI Agent、软件工程和自动化工作流。</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
