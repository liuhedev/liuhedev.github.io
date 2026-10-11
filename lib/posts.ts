import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostMetadata } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'content/posts')

function normalizeDate(value: unknown): string | null {
  if (!value) return null
  if (value instanceof Date) return value.toISOString().split('T')[0]
  if (typeof value !== 'string') return null

  const normalized = value.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null
}

function getPublicDate(data: Record<string, unknown>) {
  const writtenAt = normalizeDate(data.writtenAt)
  if (writtenAt) return { date: writtenAt, dateType: 'written' as const }

  const publishedAt = normalizeDate(data.publishedAt) || normalizeDate(data.date)
  if (publishedAt) return { date: publishedAt, dateType: 'published' as const }

  return null
}

export function getAllPosts(): PostMetadata[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      const publicDate = getPublicDate(data)
      if (!publicDate) return null

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt || data.summary || data.description || '',
        ...publicDate,
        readingTime: data.readingTime,
        tags: data.tags || [],
        source: data.source || 'wechat',
        sourceUrl: data.sourceUrl,
        coverImage: data.coverImage,
      } as PostMetadata
    })
    .filter((post): post is PostMetadata => post !== null)

  return allPostsData.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const publicDate = getPublicDate(data)
    if (!publicDate) return null

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt || data.summary || data.description || '',
      content,
      ...publicDate,
      readingTime: data.readingTime,
      tags: data.tags || [],
      source: data.source || 'wechat',
      sourceUrl: data.sourceUrl,
      coverImage: data.coverImage,
    } as Post
  } catch (error) {
    return null
  }
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): PostMetadata[] {
  const allPosts = getAllPosts()

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => tags.includes(tag)))
    .slice(0, limit)
}
