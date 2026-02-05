import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold font-display">404</h1>
        <h2 className="text-2xl font-semibold text-secondary dark:text-secondary-dark">
          文章未找到
        </h2>
        <p className="text-secondary dark:text-secondary-dark">
          抱歉，您访问的文章不存在或已被删除。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 btn btn-primary px-6 py-3 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>
      </div>
    </div>
  )
}
