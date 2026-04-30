import { Github, Mail } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-rule-soft">
      <div className="container-page py-14">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 sm:col-span-6 lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/avatar.jpg"
                alt="刘贺"
                width={36}
                height={36}
                className="rounded-full ring-1 ring-rule/30"
              />
              <div>
                <div className="font-display font-semibold text-base">刘贺同学</div>
                <div className="meta">AI 工程化实践 · Notebook of Practice</div>
              </div>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed max-w-xl">
              文章会同步发布到掘金 / 知乎 / 微信公众号「刘贺同学」。
              欢迎在公众号留言交流，或在 GitHub 提 issue。
            </p>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <div className="meta mb-3">Find Me</div>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="https://github.com/liuhedev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://juejin.cn/user/3220876915519960"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  掘金
                </a>
              </li>
              <li>
                <a
                  href="https://www.zhihu.com/people/liuhe-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  知乎
                </a>
              </li>
              <li>
                <a
                  href="mailto:liuhedev@gmail.com"
                  className="inline-flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-3 sm:text-right">
            <div className="meta mb-3">Colophon</div>
            <p className="text-xs text-muted leading-relaxed">
              Set in <span className="font-display italic">Fraunces</span>,
              IBM Plex Sans &amp; JetBrains Mono. Built with Next.js.
            </p>
            <p className="meta mt-3">© {new Date().getFullYear()} · 刘贺</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
