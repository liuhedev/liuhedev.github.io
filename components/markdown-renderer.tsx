'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'
import { slugifyHeading } from '@/lib/markdown-headings'

interface MarkdownRendererProps {
  content: string
}

function childrenToText(children: React.ReactNode): string {
  return React.Children.toArray(children).map((child) => {
    if (typeof child === 'string' || typeof child === 'number') return String(child)
    if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return childrenToText(child.props.children)
    }
    return ''
  }).join('')
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="article-prose prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: () => null,
          h2: ({ node: _node, children, ...props }) => {
            const id = slugifyHeading(childrenToText(children))
            return <h2 id={id} {...props}>{children}</h2>
          },
          h3: ({ node: _node, children, ...props }) => {
            const id = slugifyHeading(childrenToText(children))
            return <h3 id={id} {...props}>{children}</h3>
          },
          h4: ({ node: _node, children, ...props }) => {
            const id = slugifyHeading(childrenToText(children))
            return <h4 id={id} {...props}>{children}</h4>
          },
          a: ({ node: _node, href = '', children, ...props }) => {
            const external = /^https?:\/\//.test(href)
            return <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>{children}</a>
          },
          img: ({ node: _node, alt = '', ...props }) => <img alt={alt} loading="lazy" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
