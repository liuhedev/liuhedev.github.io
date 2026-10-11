'use client'

import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="article-prose prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: () => null,
          h2: ({ children, ...props }) => {
            const text = String(children).replace(/[`*_~]/g, '')
            const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
            return <h2 id={id} {...props}>{children}</h2>
          },
          h3: ({ children, ...props }) => {
            const text = String(children).replace(/[`*_~]/g, '')
            const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
            return <h3 id={id} {...props}>{children}</h3>
          },
          h4: ({ children, ...props }) => {
            const text = String(children).replace(/[`*_~]/g, '')
            const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
            return <h4 id={id} {...props}>{children}</h4>
          },
          a: ({ href = '', children, ...props }) => {
            const external = /^https?:\/\//.test(href)
            return <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>{children}</a>
          },
          img: ({ alt = '', ...props }) => <img alt={alt} loading="lazy" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
