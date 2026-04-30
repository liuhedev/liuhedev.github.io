import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { IndexBoard } from '@/components/index-board'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts()
  const total = posts.length
  const issueNo = String(total).padStart(2, '0')
  const lastUpdate = posts[0]?.date

  return (
    <>
      <main className="min-h-screen">
        {/* Masthead */}
        <header className="container-page pt-6 pb-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/avatar.jpg"
                alt="刘贺"
                width={32}
                height={32}
                className="rounded-full ring-1 ring-rule/40 group-hover:ring-accent transition"
                priority
              />
              <div className="flex items-baseline gap-2">
                <span className="font-display font-semibold tracking-tight text-base">
                  刘贺同学
                </span>
                <span className="meta hidden sm:inline">Notebook of Practice</span>
              </div>
            </Link>
            <nav className="flex items-center gap-2">
              <a
                className="ghost-btn hidden sm:inline-flex"
                href="https://github.com/liuhedev"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="ghost-btn hidden sm:inline-flex"
                href="https://juejin.cn/user/3220876915519960"
                target="_blank"
                rel="noopener noreferrer"
              >
                掘金
              </a>
              <ThemeToggle />
            </nav>
          </div>
          <hr className="rule mt-5 draw-rule" />
        </header>

        {/* Editorial banner */}
        <section className="container-page pt-10 pb-10 lg:pt-14 lg:pb-12">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-8">
              <div className="meta mb-3">Issue №{issueNo} · Spring 2026 · Engineering Log</div>
              <h1 className="display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-medium text-balance">
                A field notebook for{' '}
                <span className="display-italic text-accent">AI agents</span>
                {' '}in production.
              </h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg text-ink-soft leading-relaxed text-pretty">
                十年全栈，支付系统老兵。这里是我跑 Claude Code、OpenClaw、Hermes 的实测笔记——
                Agent 怎么搭、Skill 怎么沉淀、踩了哪些坑、把哪些工作流榨成模板。
                共 <span className="text-accent font-medium tabular-nums">{total}</span> 篇，
                持续在写。
              </p>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:pl-6 lg:border-l lg:border-rule-soft">
              <dl className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-3">
                <Stat label="Entries" value={String(total).padStart(2, '0')} />
                <Stat
                  label="Latest"
                  value={
                    lastUpdate
                      ? new Date(lastUpdate).toISOString().slice(0, 10)
                      : '—'
                  }
                />
                <Stat label="Languages" value="ZH · EN" />
              </dl>
            </div>
          </div>
        </section>

        <hr className="container-page rule-soft" />

        {/* Index board (filterable) */}
        <IndexBoard posts={posts} />
      </main>

      <Footer />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="meta">{label}</dt>
      <dd className="font-display text-2xl lg:text-3xl mt-1 tabular-nums tracking-tight">
        {value}
      </dd>
    </div>
  )
}
