'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { PostMetadata } from '@/types/post'

type Series = '龙虾哥打工日记' | 'Claude Code 拆解' | 'OpenClaw 实战' | '随笔 / Notes'

const SERIES_ORDER: Series[] = ['龙虾哥打工日记', 'Claude Code 拆解', 'OpenClaw 实战', '随笔 / Notes']

function inferSeries(title: string): Series {
  if (/^\s*Day\s*\d+/i.test(title) || /龙虾哥打工日记/.test(title)) return '龙虾哥打工日记'
  if (/(Claude\s*Code|Hermes|Superpowers|Skill[s]?|Agent\s+Browser|Karpathy)/i.test(title)) return 'Claude Code 拆解'
  if (/(OpenClaw|Cron|Wiki|Workspace|qodercli|lark[-\s]?cli|AutoResearch|GStack)/i.test(title)) return 'OpenClaw 实战'
  return '随笔 / Notes'
}

function fmtMonthDay(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '··  ··'
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}·${day}`
}

function yearOf(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '0000'
  return String(d.getFullYear())
}

function monthKey(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '0000-00'
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

type Filter =
  | { kind: 'all' }
  | { kind: 'series'; value: Series }
  | { kind: 'month'; value: string }
  | { kind: 'year'; value: string }

export function IndexBoard({ posts }: { posts: PostMetadata[] }) {
  const [filter, setFilter] = useState<Filter>({ kind: 'all' })
  const [query, setQuery] = useState('')

  const enriched = useMemo(
    () =>
      posts.map((p) => ({
        ...p,
        series: inferSeries(p.title),
        month: monthKey(p.date),
        year: yearOf(p.date),
      })),
    [posts]
  )

  const seriesCounts = useMemo(() => {
    const m = new Map<Series, number>()
    SERIES_ORDER.forEach((s) => m.set(s, 0))
    for (const p of enriched) m.set(p.series, (m.get(p.series) || 0) + 1)
    return m
  }, [enriched])

  const monthCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of enriched) m.set(p.month, (m.get(p.month) || 0) + 1)
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [enriched])

  const filtered = useMemo(() => {
    return enriched.filter((p) => {
      if (filter.kind === 'series' && p.series !== filter.value) return false
      if (filter.kind === 'month' && p.month !== filter.value) return false
      if (filter.kind === 'year' && p.year !== filter.value) return false
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        const hay = `${p.title} ${p.excerpt ?? ''} ${p.tags.join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [enriched, filter, query])

  const grouped = useMemo(() => {
    const m = new Map<string, typeof filtered>()
    for (const p of filtered) {
      if (!m.has(p.month)) m.set(p.month, [] as typeof filtered)
      m.get(p.month)!.push(p)
    }
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
  }, [filtered])

  const filterLabel =
    filter.kind === 'all'
      ? `All  ·  ${enriched.length}`
      : filter.kind === 'series'
        ? `Series · ${filter.value}`
        : filter.kind === 'month'
          ? `Month · ${filter.value}`
          : `Year · ${filter.value}`

  return (
    <section className="container-page mt-12 lg:mt-16">
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          className="ghost-btn"
          aria-pressed={filter.kind === 'all'}
          onClick={() => setFilter({ kind: 'all' })}
        >
          All · {enriched.length}
        </button>
        {SERIES_ORDER.map((s) => {
          const c = seriesCounts.get(s) || 0
          if (c === 0) return null
          const active = filter.kind === 'series' && filter.value === s
          return (
            <button
              key={s}
              className="ghost-btn"
              aria-pressed={active}
              onClick={() => setFilter(active ? { kind: 'all' } : { kind: 'series', value: s })}
            >
              {s} · {c}
            </button>
          )
        })}
        <div className="flex-1" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ⌕"
          aria-label="搜索文章"
          className="bg-transparent border border-rule-soft hover:border-rule focus:border-accent
                     px-3 py-1.5 font-mono text-xs tracking-wider w-44 sm:w-56
                     transition-colors outline-none"
        />
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        {/* Index list */}
        <div className="col-span-12 lg:col-span-8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="meta">Index · 索引</h2>
            <span className="meta">{filterLabel} · {filtered.length} entries</span>
          </div>

          <hr className="rule mb-2" />

          {grouped.length === 0 && (
            <div className="py-16 text-center text-muted font-display italic">
              空空如也。换一个筛选条件试试。
            </div>
          )}

          {grouped.map(([m, list], gi) => (
            <div key={m} className="mb-10">
              <div className="flex items-baseline gap-3 mt-6 mb-3">
                <span className="meta tracking-tracked-lg">{m.replace('-', ' / ')}</span>
                <hr className="rule-soft flex-1" />
                <span className="meta">{list.length}</span>
              </div>

              <ul className="divide-y divide-rule-soft">
                {list.map((p, i) => (
                  <li key={p.slug}>
                    <Link
                      href={`/posts/${p.slug}`}
                      className="row reveal grid grid-cols-[16px_64px_1fr_auto] items-baseline gap-x-4 py-3.5 group"
                      style={{ animationDelay: `${Math.min(i, 14) * 30}ms` }}
                    >
                      <span className="row-marker self-center" aria-hidden />
                      <span className="font-mono text-xs tracking-wider text-muted tabular-nums">
                        {fmtMonthDay(p.date)}
                      </span>
                      <span className="row-title text-[1.05rem] sm:text-[1.1rem] leading-snug font-medium transition-colors text-pretty">
                        {p.title}
                        <ArrowUpRight
                          className="row-arrow inline-block ml-1.5 -translate-y-0.5 text-accent"
                          size={14}
                          strokeWidth={2.4}
                        />
                      </span>
                      <span className="hidden sm:flex items-center gap-3 font-mono text-[0.65rem] tracking-wider uppercase text-muted">
                        <span className="text-accent/80">{shortSeries(p.series)}</span>
                        {p.readingTime ? <span>{p.readingTime}′</span> : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 lg:pl-2 space-y-10">
          <SidebarBlock label="Series · 系列">
            <ul className="space-y-1">
              {SERIES_ORDER.map((s) => {
                const c = seriesCounts.get(s) || 0
                if (c === 0) return null
                const active = filter.kind === 'series' && filter.value === s
                return (
                  <li key={s}>
                    <button
                      onClick={() =>
                        setFilter(active ? { kind: 'all' } : { kind: 'series', value: s })
                      }
                      className={`w-full text-left flex items-baseline justify-between py-1.5 group transition-colors ${
                        active ? 'text-accent' : 'hover:text-accent'
                      }`}
                    >
                      <span className="text-sm">{s}</span>
                      <span className="font-mono text-xs text-muted group-hover:text-accent">
                        {String(c).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </SidebarBlock>

          <SidebarBlock label="Archive · 归档">
            <ul className="grid grid-cols-2 gap-x-4">
              {monthCounts.map(([m, c]) => {
                const active = filter.kind === 'month' && filter.value === m
                return (
                  <li key={m}>
                    <button
                      onClick={() =>
                        setFilter(active ? { kind: 'all' } : { kind: 'month', value: m })
                      }
                      className={`w-full text-left flex items-baseline justify-between py-1 transition-colors ${
                        active ? 'text-accent' : 'hover:text-accent'
                      }`}
                    >
                      <span className="font-mono text-xs tracking-wider">{m}</span>
                      <span className="font-mono text-xs text-muted">
                        {String(c).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </SidebarBlock>

          <SidebarBlock label="Colophon · 关于">
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="font-display italic text-base">Notebook of Practice.</span>
              {' '}十年全栈、支付系统老兵，现在写 AI Agent 工程化落地。
              文章会同步到{' '}
              <a className="underline decoration-accent decoration-1 underline-offset-4 hover:text-accent" href="https://juejin.cn/user/3220876915519960" target="_blank" rel="noopener noreferrer">掘金</a>、
              <a className="underline decoration-accent decoration-1 underline-offset-4 hover:text-accent" href="https://www.zhihu.com/people/liuhe-dev" target="_blank" rel="noopener noreferrer">知乎</a>、
              微信公众号「刘贺同学」。
            </p>
          </SidebarBlock>
        </aside>
      </div>
    </section>
  )
}

function SidebarBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className="meta">{label}</h3>
        <hr className="rule-soft flex-1" />
      </div>
      {children}
    </div>
  )
}

function shortSeries(s: Series): string {
  switch (s) {
    case '龙虾哥打工日记':
      return 'DAY LOG'
    case 'Claude Code 拆解':
      return 'CC TEARDOWN'
    case 'OpenClaw 实战':
      return 'OPENCLAW'
    case '随笔 / Notes':
      return 'NOTES'
  }
}
