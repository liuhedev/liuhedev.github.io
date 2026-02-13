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
    <div className="prose prose-zinc dark:prose-invert max-w-none
      prose-headings:font-display prose-headings:font-bold
      prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0
      prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12
      prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8
      prose-p:text-base prose-p:leading-7 prose-p:mb-4
      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
      prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:p-4
      prose-ul:my-4 prose-ol:my-4
      prose-li:my-2
      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic">
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
