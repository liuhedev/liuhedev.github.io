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
const placeholderTitle = /^(untitled|todo|tbd|待定|无标题|null|undefined)$/i

assert.equal(index.version, 1)
const sourceFiles = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'))
const hiddenSlugs = sourceFiles
  .filter((fileName) => matter(fs.readFileSync(path.join(postsDirectory, fileName), 'utf8')).data.listed === false)
  .map((fileName) => fileName.replace(/\.md$/, ''))
  .sort()

assert.equal(sourceFiles.length, 46, 'unexpected source article count')
assert.deepEqual(hiddenSlugs, [duplicateSlug, archivedSlug], 'unexpected hidden article set')
assert.equal(index.articles.length, 44)

function publicPathForImage(reference) {
  if (reference.startsWith('/')) return reference

  const siteUrl = 'https://liuhedev.github.io/'
  if (reference.startsWith(siteUrl)) return new URL(reference).pathname

  const rawPrefix = 'https://raw.githubusercontent.com/liuhedev/liuhedev.github.io/main/public/'
  if (reference.startsWith(rawPrefix)) return `/${reference.slice(rawPrefix.length)}`

  return null
}

for (const fileName of sourceFiles) {
  const source = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8')
  const { data, content } = matter(source)
  const title = String(data.title || '').trim()

  assert(title && !placeholderTitle.test(title), `${fileName} has an empty or placeholder title`)
  assert(content.trim(), `${fileName} has an empty body`)
  assert(data.publishedAt || data.writtenAt || data.date, `${fileName} has no date`)
  assert(
    data.readingTime === undefined || (typeof data.readingTime === 'number' && data.readingTime > 0),
    `${fileName} has an invalid readingTime`,
  )

  const imageReferences = [
    ...content.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)|<img[^>]+src=['"]([^'"]+)/gi),
  ].map((match) => match[1] || match[2])
  if (data.cover || data.coverImage) imageReferences.push(data.cover || data.coverImage)

  for (const reference of imageReferences) {
    if (/^https?:\/\//.test(reference) && !reference.includes('liuhedev.github.io') && !reference.includes('raw.githubusercontent.com/liuhedev/liuhedev.github.io')) continue
    const publicPath = publicPathForImage(reference)
    assert(publicPath, `${fileName} uses an unresolved relative image: ${reference}`)
    assert(
      fs.existsSync(path.join(process.cwd(), 'public', decodeURIComponent(publicPath).replace(/^\//, ''))),
      `${fileName} references a missing public image: ${reference}`,
    )
  }
}

const readNormalizedBody = (slug) =>
  matter(fs.readFileSync(path.join(postsDirectory, `${slug}.md`), 'utf8'))
    .content.replaceAll('https://liuhedev.github.io/images/', '/images/')
    .trim()

const credentialScreenshotNames = [
  'file-20260131215002593.png',
  'file-20260131224255718.png',
]
const clawdbotSource = fs.readFileSync(
  path.join(postsDirectory, '2026-01-31-5-clawdbot.md'),
  'utf8',
)
for (const fileName of credentialScreenshotNames) {
  assert(!clawdbotSource.includes(fileName), `${fileName} must not be publicly referenced`)
  assert(
    !fs.existsSync(path.join(process.cwd(), 'public', 'images', '2026-01-31', fileName)),
    `${fileName} must not be included in the public build`,
  )
}

assert.equal(
  readNormalizedBody(duplicateSlug),
  readNormalizedBody(canonicalSlug),
  'the hidden article must remain equivalent to the canonical article',
)

for (const article of index.articles) {
  assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/)
  assert(['published', 'written'].includes(article.dateType))
  assert(
    article.title.trim() && !placeholderTitle.test(article.title.trim()),
    `public article has an empty or placeholder title: ${article.url}`,
  )
  assert(article.excerpt.trim(), `public article has an empty excerpt: ${article.url}`)
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

for (const fileName of sourceFiles) {
  const slug = fileName.replace(/\.md$/, '')
  const htmlPath = path.join(outputDirectory, 'posts', `${slug}.html`)
  assert(fs.existsSync(htmlPath), `${slug} was not built`)
  const html = fs.readFileSync(htmlPath, 'utf8')
  assert(!html.includes('node="[object Object]"'), `${slug} leaks react-markdown node props`)

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]))
  const localAnchors = [...html.matchAll(/\shref="#([^"]+)"/g)].map((match) => match[1])
  for (const anchor of localAnchors) {
    assert(ids.has(anchor), `${slug} links to a missing local anchor: #${anchor}`)
  }
}

const sitemap = fs.readFileSync(path.join(outputDirectory, 'sitemap.xml'), 'utf8')
assert(sitemap.includes(`/posts/${canonicalSlug}`))
assert(!sitemap.includes(`/posts/${duplicateSlug}`))
assert(!sitemap.includes(`/posts/${archivedSlug}`))

const homePage = fs.readFileSync(path.join(outputDirectory, 'index.html'), 'utf8')
assert(homePage.includes('>44 篇</dd>'))
assert.equal(
  [...homePage.matchAll(/href="\/posts\//g)].length,
  10,
  'the homepage must initially render the latest 10 articles',
)
assert.match(homePage, /查看更多（已显示 .*10.* \/ .*44.*）/)
assert(!homePage.includes('文章由 Markdown 驱动'))
assert(!homePage.includes('href="/icon"'))
assert(!homePage.includes('href="/apple-icon"'))

console.log('Verified 46 rendered articles, 44 public index entries, metadata, images, and anchors.')
