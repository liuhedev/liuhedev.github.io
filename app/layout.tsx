import type { Metadata } from 'next'
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'opsz'],
})

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://liuhedev.github.io'),
  title: {
    default: '刘贺同学 · Notebook of Practice',
    template: '%s · 刘贺同学',
  },
  description: 'AI 工程化实践、Agent 落地踩坑、Claude Code / OpenClaw / Hermes 拆解笔记。',
  keywords: ['OpenClaw', 'Hermes', 'Claude Code', 'AI Agent', 'AI编程', '龙虾哥打工日记', '刘贺同学'],
  authors: [{ name: '刘贺', url: 'https://github.com/liuhedev' }],
  creator: '刘贺',
  publisher: '刘贺同学',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://liuhedev.github.io',
    title: '刘贺同学 · Notebook of Practice',
    description: 'AI 工程化实践、Agent 落地踩坑笔记',
    siteName: '刘贺同学技术博客',
  },
  twitter: {
    card: 'summary_large_image',
    title: '刘贺同学 · Notebook of Practice',
    description: 'AI 工程化实践、Agent 落地踩坑笔记',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION ? { 'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION } : {}),
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : {}),
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${plex.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
