import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export function GET() {
  const articles = getAllPosts().map((post) => ({
    title: post.title,
    url: `https://liuhedev.github.io/posts/${post.slug}`,
    date: post.date,
    dateType: post.dateType,
    excerpt: post.excerpt,
  }))

  return Response.json({ version: 1, articles })
}
