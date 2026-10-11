export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')
}

function inlineMarkdownToText(value: string): string {
  const inlineCode: string[] = []
  const withoutCode = value.replace(/`([^`]+)`/g, (_match, code) => {
    inlineCode.push(code)
    return `\u0000${inlineCode.length - 1}\u0000`
  })

  return withoutCode
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/[\*~]/g, '')
    .replace(/\u0000(\d+)\u0000/g, (_match, index) => inlineCode[Number(index)])
    .trim()
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  let fence: string | null = null

  for (const line of content.split('\n')) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
    if (fenceMatch) {
      fence = fence ? null : fenceMatch[1][0]
      continue
    }
    if (fence) continue

    const match = line.match(/^(#{2,4})\s+(.+)$/)
    if (!match) continue

    const text = inlineMarkdownToText(match[2])
    headings.push({ id: slugifyHeading(text), text, level: match[1].length })
  }

  return headings
}
