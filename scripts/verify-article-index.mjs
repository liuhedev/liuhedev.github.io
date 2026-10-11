import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const outputDirectory = path.join(process.cwd(), 'out')
const postsDirectory = path.join(process.cwd(), 'content', 'posts')
const index = JSON.parse(fs.readFileSync(path.join(outputDirectory, 'articles.json'), 'utf8'))
const duplicateSlug = '2026-03-09-2026-03-09-browser-automation-experiment'
const canonicalSlug = '2026-03-09-browser-automation-experiment'
const archivedSlug = '2026-04-04-claude-restricts-openclaw'

assert.equal(index.version, 1)
const sourceFiles = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'))
const hiddenSlugs = sourceFiles
  .filter((fileName) => matter(fs.readFileSync(path.join(postsDirectory, fileName), 'utf8')).data.listed === false)
  .map((fileName) => fileName.replace(/\.md$/, ''))

assert.equal(sourceFiles.length, 46, 'unexpected source article count')
assert.deepEqual(hiddenSlugs, [duplicateSlug, archivedSlug], 'unexpected hidden article set')
assert.equal(index.articles.length, 44)

const readNormalizedBody = (slug) =>
  matter(fs.readFileSync(path.join(postsDirectory, `${slug}.md`), 'utf8'))
    .content.replaceAll('https://liuhedev.github.io/images/', '/images/')
    .trim()
assert.equal(
  readNormalizedBody(duplicateSlug),
  readNormalizedBody(canonicalSlug),
  'the hidden article must remain equivalent to the canonical article',
)

for (const article of index.articles) {
  assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/)
  assert(['published', 'written'].includes(article.dateType))
}

const urls = index.articles.map((article) => article.url)
assert(urls.includes(`https://liuhedev.github.io/posts/${canonicalSlug}`))
assert(!urls.includes(`https://liuhedev.github.io/posts/${duplicateSlug}`))
assert(!urls.includes(`https://liuhedev.github.io/posts/${archivedSlug}`))

const normalizedTitles = index.articles.map((article) =>
  article.title.toLocaleLowerCase('zh-CN').replace(/[\p{P}\p{S}\s]+/gu, ''),
)
assert.equal(new Set(normalizedTitles).size, normalizedTitles.length, 'listed titles are duplicated')

for (let indexPosition = 1; indexPosition < index.articles.length; indexPosition += 1) {
  const previous = index.articles[indexPosition - 1]
  const current = index.articles[indexPosition]
  assert(
    previous.date > current.date ||
      (previous.date === current.date && previous.url.localeCompare(current.url) <= 0),
    `articles are out of order: ${previous.url} before ${current.url}`,
  )
}

for (const slug of [canonicalSlug, duplicateSlug, archivedSlug]) {
  assert(fs.existsSync(path.join(outputDirectory, 'posts', `${slug}.html`)), `${slug} was not built`)
}

const sitemap = fs.readFileSync(path.join(outputDirectory, 'sitemap.xml'), 'utf8')
assert(sitemap.includes(`/posts/${canonicalSlug}`))
assert(!sitemap.includes(`/posts/${duplicateSlug}`))
assert(!sitemap.includes(`/posts/${archivedSlug}`))

const homePage = fs.readFileSync(path.join(outputDirectory, 'index.html'), 'utf8')
assert(homePage.includes('>44</span> 篇'))

console.log('Verified 44 unique listed articles; hidden legacy routes remain built.')
