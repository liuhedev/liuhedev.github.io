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
    default: '刘贺同学 | AI超级个体实践者',
    template: '%s | 刘贺同学',
  },
  description: '专注 AI 工程化实践与落地场景。一个人 + AI = AI超级个体。',
  keywords: ['全栈开发', '前端', '后端', 'AI', '技术博客', '系统设计', '刘贺'],
  authors: [{ name: '刘贺', url: 'https://github.com/liuhedev' }],
  creator: '刘贺',
  publisher: '刘贺同学',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://liuhedev.github.io',
    title: '刘贺同学 | AI超级个体实践者',
    description: '专注 AI 工程化实践与落地场景',
    siteName: '刘贺同学技术博客',
  },
  twitter: {
    card: 'summary_large_image',
    title: '刘贺同学 | AI超级个体实践者',
    description: '专注 AI 工程化实践与落地场景',
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
