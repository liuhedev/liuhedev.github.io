export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  dateType: 'published' | 'written'
  readingTime: number
  tags: string[]
  source: string
  sourceUrl?: string
  coverImage?: string
}

export interface PostMetadata {
  slug: string
  title: string
  excerpt: string
  date: string
  dateType: 'published' | 'written'
  readingTime: number
  tags: string[]
  source: string
  sourceUrl?: string
  coverImage?: string
  listed: boolean
}
