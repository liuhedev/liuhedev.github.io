'use client'

import { BookOpen, Github, Mail, MessageCircle, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

function trapDialogFocus(event: ReactKeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') return
  const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')]
  const first = focusable[0]
  const last = focusable.at(-1)
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

export function Footer() {
  const [wechatOpen, setWechatOpen] = useState(false)
  const wechatButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!wechatOpen) return

    const trigger = wechatButton.current
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWechatOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      trigger?.focus()
    }
  }, [wechatOpen])

  return (
    <footer className="mt-32 border-t border-rule-soft">
      <div className="container-page py-14">
        <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/avatar.jpg"
                alt="刘贺"
                width={36}
                height={36}
                className="rounded-full ring-1 ring-rule/30"
              />
              <div>
                <div className="font-display text-base font-semibold">刘贺同学</div>
                <div className="meta">AI 工程化实践 · Notebook of Practice</div>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              关注微信公众号「刘贺同学」，一起交流 AI 工程化、软件工程与自动化实践。
            </p>
          </div>

          <div>
            <div className="meta mb-3">保持联系</div>
            <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <li>
                <a
                  href="https://github.com/liuhedev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://my.feishu.cn/wiki/YjJ6wh9v9iLDc2kfvdMcoMsrn2g"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <BookOpen className="h-4 w-4" /> 飞书知识库
                </a>
              </li>
              <li>
                <a
                  href="mailto:liuhedev@gmail.com"
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              </li>
              <li>
                <button
                  ref={wechatButton}
                  type="button"
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                  onClick={() => setWechatOpen(true)}
                >
                  <MessageCircle className="h-4 w-4" /> 微信公众号
                </button>
              </li>
            </ul>
            <p className="meta mt-5">© {new Date().getFullYear()} · 刘贺</p>
          </div>
        </div>
      </div>

      {wechatOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setWechatOpen(false)
          }}
        >
          <section
            aria-labelledby="wechat-dialog-title"
            aria-modal="true"
            className="relative w-full max-w-3xl rounded-sm bg-paper p-5 shadow-2xl sm:p-8"
            role="dialog"
            onKeyDown={trapDialogFocus}
          >
            <button
              ref={closeButton}
              type="button"
              aria-label="关闭微信公众号二维码"
              className="absolute right-3 top-3 rounded-full p-2 text-muted transition-colors hover:bg-rule-soft hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => setWechatOpen(false)}
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
            <div className="pr-10">
              <p className="meta mb-2">微信公众号</p>
              <h2 id="wechat-dialog-title" className="text-2xl font-medium tracking-tight">刘贺同学</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">微信扫码关注；手机上可长按二维码保存。</p>
            </div>
            <Image
              src="/contacts/wechat-qrcode.png?v=c918cc10"
              alt="微信公众号刘贺同学二维码"
              width={2076}
              height={758}
              className="mt-6 h-auto w-full rounded-sm border border-rule-soft"
            />
            <a
              href="/contacts/wechat-qrcode.png?v=c918cc10"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              查看原图
            </a>
          </section>
        </div>
      ) : null}
    </footer>
  )
}
