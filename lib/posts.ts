import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostMetadata } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): PostMetadata[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        readingTime: data.readingTime,
        tags: data.tags || [],
        source: data.source || 'wechat',
        sourceUrl: data.sourceUrl,
        coverImage: data.coverImage,
      } as PostMetadata
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content,
      date: data.date,
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
