'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState('')
  
  // 从 markdown 提取 headings
  const headings: TocItem[] = content
    .split('\n')
    .filter(line => /^#{2,4}\s/.test(line))
    .map(line => {
      const match = line.match(/^(#{2,4})\s+(.+)$/)
      if (!match) return null
      const text = match[2].replace(/[`*_~]/g, '')
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-|-$/g, '')
      return { id, text, level: match[1].length }
    })
    .filter(Boolean) as TocItem[]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">目录</p>
      <ul className="space-y-1.5 text-sm border-l border-zinc-200 dark:border-zinc-700">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block py-1 transition-colors ${
                level === 2 ? 'pl-4' : level === 3 ? 'pl-8' : 'pl-12'
              } ${
                activeId === id
                  ? 'text-blue-600 dark:text-blue-400 border-l-2 border-blue-600 dark:border-blue-400 -ml-px font-medium'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
