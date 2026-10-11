import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="刘贺同学技术博客首页">
          <Image src="/avatar.jpg" alt="刘贺" width={36} height={36} className="rounded-full" priority />
          <span className="font-semibold tracking-tight">刘贺同学</span>
          <span className="meta hidden sm:inline">技术博客</span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="主要导航">
          <a className="header-link hidden sm:inline-flex" href="https://liuhe.abloomvole8.chatgpt.site">个人网站</a>
          <a className="header-link hidden sm:inline-flex" href="https://github.com/liuhedev">GitHub</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
