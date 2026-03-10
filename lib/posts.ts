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

      // 确保日期字段有效
      let date = data.date
      if (!date) {
        // 如果没有日期字段，尝试从文件名中提取
        const match = fileName.match(/(\d{4}-\d{2}-\d{2})/)
        if (match) {
          date = match[1]
        } else {
          // 默认日期为当前日期
          date = new Date().toISOString().split('T')[0]
        }
      }
      // 确保日期格式为字符串
      if (typeof date !== 'string') {
        date = date.toISOString().split('T')[0]
      }

      return {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        date,
        readingTime: data.readingTime,
        tags: data.tags || [],
        source: data.source || 'wechat',
        sourceUrl: data.sourceUrl,
        coverImage: data.coverImage,
      } as PostMetadata
    })
    // 过滤掉无效日期的文章
    .filter(post => post.date && !isNaN(new Date(post.date).getTime()))

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // 确保日期字段有效
    let date = data.date
    if (!date) {
      // 如果没有日期字段，尝试从文件名中提取
      const match = slug.match(/(\d{4}-\d{2}-\d{2})/)
      if (match) {
        date = match[1]
      } else {
        // 默认日期为当前日期
        date = new Date().toISOString().split('T')[0]
      }
    }
    // 确保日期格式为字符串
    if (typeof date !== 'string') {
      date = date.toISOString().split('T')[0]
    }

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content,
      date,
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
