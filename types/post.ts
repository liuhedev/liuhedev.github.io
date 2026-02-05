export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readingTime: number
  tags: string[]
  source: 'feishu' | 'wechat' | 'github'
  sourceUrl?: string
  coverImage?: string
}

export interface PostMetadata {
  slug: string
  title: string
  excerpt: string
  date: string
  readingTime: number
  tags: string[]
  source: 'feishu' | 'wechat' | 'github'
  sourceUrl?: string
  coverImage?: string
}
