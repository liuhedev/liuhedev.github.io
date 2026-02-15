import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { Github, Mail, ChevronDown } from 'lucide-react'
import { getAllPosts } from '@/lib/posts'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const posts = getAllPosts()

  const sourceLabels: Record<string, { text: string; emoji: string; color: string }> = {
    feishu: { text: '飞书', emoji: '☁️', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    wechat: { text: '公众号', emoji: '💬', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    github: { text: 'GitHub', emoji: '🐙', color: 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' },
    openclaw: { text: 'OpenClaw', emoji: '🤖', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  }

  return (
    <>
      <main className="min-h-screen">
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

        {/* Hero Section */}
        <section className="container-custom py-24 md:py-32">
          <div className="flex flex-col items-center text-center gap-8 animate-fade-in">
            {/* Avatar */}
            <div className="relative">
              <Image
                src="/avatar.jpg"
                alt="刘贺"
                width={120}
                height={120}
                className="rounded-full ring-4 ring-zinc-200 dark:ring-zinc-800"
                priority
              />
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display text-balance">
                刘贺同学
              </h1>
              <p className="text-xl md:text-2xl text-secondary dark:text-secondary-dark">
                10年+ 全栈开发工程师 | 支付系统研发老兵 | 专注 AI 工程化实践与落地场景
              </p>
            </div>

            {/* Description */}
            <p className="max-w-2xl text-lg text-secondary dark:text-secondary-dark text-balance">
              一个人 + AI = AI超级个体。专注工程化落地与场景实践，持续输出可复用的实战内容。
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/liuhedev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-6 py-3 cursor-pointer"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </a>
              <a
                href="mailto:liuhe@example.com"
                className="btn btn-ghost px-6 py-3 cursor-pointer"
              >
                <Mail className="h-5 w-5 mr-2" />
                邮箱
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <ChevronDown className="h-6 w-6 text-secondary dark:text-secondary-dark" />
            </div>
          </div>
        </section>

        {/* Content Timeline Section */}
        <section className="container-custom py-16">
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center">
              最新内容
            </h2>

            {/* Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {['全部', '技术文章', '开源项目', '思考随笔'].map((tag) => (
                <button
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    tag === '全部'
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Content Cards */}
            <div className="w-full max-w-4xl space-y-6">
              {posts.map((post) => {
                const sourceInfo = sourceLabels[post.source] || sourceLabels.github
                const relativeTime = getRelativeTime(post.date)

                return (
                  <Link key={post.slug} href={`/posts/${post.slug}`}>
                    <article className="card cursor-pointer">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-display font-semibold">
                            {post.title}
                          </h3>
                          <span className={`shrink-0 text-xs px-2 py-1 rounded-full ${sourceInfo.color}`}>
                            {sourceInfo.emoji} {sourceInfo.text}
                          </span>
                        </div>

                        <p className="text-secondary dark:text-secondary-dark">
                          {post.excerpt}
                        </p>

                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
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

                        <div className="flex items-center gap-4 text-sm text-secondary dark:text-secondary-dark">
                          <span>📅 {relativeTime}</span>
                          <span>⏱️ {post.readingTime} 分钟阅读</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>

            {/* Load More - 暂时隐藏 */}
            {posts.length === 0 && (
              <div className="text-center text-secondary dark:text-secondary-dark">
                <p>暂无文章</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return '今天'
  if (diffInDays === 1) return '1 天前'
  if (diffInDays < 7) return `${diffInDays} 天前`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} 周前'`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} 个月前`
  return `${Math.floor(diffInDays / 365)} 年前`
}
