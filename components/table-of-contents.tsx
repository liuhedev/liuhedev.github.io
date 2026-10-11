'use client'

import { useEffect, useMemo, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState('')
  
  // 从 markdown 提取 headings
  const headings = useMemo(() => content
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
    .filter(Boolean) as TocItem[], [content])

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
    <nav className="toc" aria-label="文章目录">
      <p className="meta mb-4">目录</p>
      <ul className="space-y-1.5 border-l border-rule-soft text-sm">
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
                  ? 'text-accent border-l-2 border-accent -ml-px font-medium'
                  : 'text-muted hover:text-ink'
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
