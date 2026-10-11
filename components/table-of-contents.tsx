'use client'

import { useEffect, useMemo, useState } from 'react'
import { extractMarkdownHeadings } from '@/lib/markdown-headings'

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState('')
  
  const headings = useMemo(() => extractMarkdownHeadings(content), [content])

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
