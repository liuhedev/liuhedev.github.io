import { Github, Mail } from 'lucide-react'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-24">
      <div className="container-custom py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <Image
            src="/avatar.jpg"
            alt="刘贺"
            width={48}
            height={48}
            className="rounded-full"
          />

          {/* Main Text */}
          <div className="text-center">
            <h3 className="font-display font-semibold text-lg mb-2">
              刘贺同学
            </h3>
            <p className="text-sm text-secondary dark:text-secondary-dark">
              全栈工程师 · 微信公众号&ldquo;刘贺同学&rdquo;
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/liuhedev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary dark:text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:liuhe@example.com"
              className="text-secondary dark:text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              aria-label="邮箱"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright & Tech Stack */}
          <div className="text-center text-sm text-secondary dark:text-secondary-dark">
            <p>© {new Date().getFullYear()} 刘贺同学</p>
            <p className="mt-1">
              使用{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Next.js
              </a>
              {' + '}
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Tailwind CSS
              </a>
              {' '}构建
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
