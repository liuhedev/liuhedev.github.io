import { Footer } from '@/components/footer'
import { IndexBoard } from '@/components/index-board'
import { SiteHeader } from '@/components/site-header'
import { getListedPosts } from '@/lib/posts'

export default function Home() {
  const posts = getListedPosts()
  const lastUpdate = posts[0]?.date

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <section className="container-page py-14 sm:py-20 lg:py-24">
          <p className="meta mb-5">Software Engineering · AI Agents · Notes</p>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <h1 className="display max-w-4xl text-5xl font-medium text-balance sm:text-6xl lg:text-7xl">
                把实践写下来，<span className="text-accent">让经验可以复用。</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
                软件工程、AI Agent 与真实工作流的长期笔记。记录做法、判断和踩过的坑。
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-6 border-t border-rule-soft pt-6 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Stat label="文章" value={`${posts.length} 篇`} />
              <Stat label="最近更新" value={lastUpdate || '—'} />
            </dl>
          </div>
        </section>
        <hr className="container-page rule-soft" />
        <IndexBoard posts={posts} />
      </main>
      <Footer />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="meta">{label}</dt>
      <dd className="mt-2 text-xl font-medium tabular-nums tracking-tight lg:text-2xl">{value}</dd>
    </div>
  )
}
