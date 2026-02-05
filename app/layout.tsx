import type { Metadata } from 'next'
import { DM_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://liuhedev.github.io'),
  title: {
    default: '刘贺同学 | 全栈工程师',
    template: '%s | 刘贺同学',
  },
  description: '全栈工程师的技术博客，专注于全栈开发、系统设计和 AI 应用。分享技术实践、项目经验和开发思考。',
  keywords: ['全栈开发', '前端', '后端', 'AI', '技术博客', '系统设计', '刘贺'],
  authors: [{ name: '刘贺', url: 'https://github.com/liuhedev' }],
  creator: '刘贺',
  publisher: '刘贺同学',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://liuhedev.github.io',
    title: '刘贺同学 | 全栈工程师',
    description: '全栈工程师的技术博客，专注于全栈开发、系统设计和 AI 应用',
    siteName: '刘贺同学技术博客',
  },
  twitter: {
    card: 'summary_large_image',
    title: '刘贺同学 | 全栈工程师',
    description: '全栈工程师的技术博客，专注于全栈开发、系统设计和 AI 应用',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
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
        className={`${dmSans.variable} ${spaceGrotesk.variable} antialiased`}
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
