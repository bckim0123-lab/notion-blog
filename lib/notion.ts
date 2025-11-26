// Notion 게시글 데이터 타입 정의
export interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string
  publishedDate: string
  category: string
  thumbnail: string | null
  content?: string
}

// Notion API 기본 설정
const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
const NOTION_VERSION = "2022-06-28"

/**
 * Notion REST API를 직접 호출하는 fetch 함수
 */
async function notionFetch(endpoint: string, options: RequestInit = {}) {
  if (!NOTION_API_KEY) {
    console.log("[v0] Missing NOTION_API_KEY, using mock data")
    return null
  }

  const url = `https://api.notion.com/v1${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`[v0] Notion API error: ${response.status} - ${errorBody}`)
    throw new Error(`Notion API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Notion 속성 값을 추출하는 헬퍼 함수들
 */
function getPlainText(property: any): string {
  if (!property) return ""

  if (property.type === "title" && property.title?.[0]) {
    return property.title[0].plain_text || ""
  }
  if (property.type === "rich_text" && property.rich_text?.[0]) {
    return property.rich_text[0].plain_text || ""
  }
  return ""
}

function getCheckbox(property: any): boolean {
  return property?.type === "checkbox" ? property.checkbox : false
}

function getDate(property: any): string {
  return property?.type === "date" ? property.date?.start || "" : ""
}

function getSelect(property: any): string {
  return property?.type === "select" ? property.select?.name || "" : ""
}

function getFiles(property: any): string | null {
  if (property?.type === "files" && property.files?.[0]) {
    // Notion 파일 타입에 따라 URL 추출
    const file = property.files[0]
    if (file.type === "file") {
      return file.file?.url || null
    } else if (file.type === "external") {
      return file.external?.url || null
    }
  }
  return null
}

/**
 * Published가 체크된 게시글 목록을 가져옵니다
 * Published Date 기준으로 최신순 정렬
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  console.log("[v0] Fetching published posts from Notion...")

  // 환경 변수가 없으면 목 데이터 반환
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.log("[v0] Using mock data - please set NOTION_API_KEY and NOTION_DATABASE_ID")
    return getMockPosts()
  }

  try {
    const response = await notionFetch(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify({
        filter: {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: "Published Date",
            direction: "descending",
          },
        ],
      }),
    })

    if (!response) {
      return getMockPosts()
    }

    const posts: BlogPost[] = response.results.map((page: any) => ({
      id: page.id,
      title: getPlainText(page.properties.Name),
      slug: getPlainText(page.properties.Slug),
      summary: getPlainText(page.properties.Summary),
      publishedDate: getDate(page.properties["Published Date"]),
      category: getSelect(page.properties.Category),
      thumbnail: getFiles(page.properties.Files),
    }))

    console.log(`[v0] Successfully fetched ${posts.length} posts from Notion`)
    return posts
  } catch (error) {
    console.error("[v0] Error fetching posts from Notion:", error)
    return getMockPosts()
  }
}

/**
 * Slug로 특정 게시글을 가져옵니다
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`[v0] Fetching post with slug: ${slug}`)

  // 환경 변수가 없으면 목 데이터 반환
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    const mockPosts = getMockPosts()
    return mockPosts.find((post) => post.slug === slug) || null
  }

  try {
    const response = await notionFetch(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify({
        filter: {
          and: [
            {
              property: "Published",
              checkbox: {
                equals: true,
              },
            },
            {
              property: "Slug",
              rich_text: {
                equals: slug,
              },
            },
          ],
        },
      }),
    })

    if (!response || response.results.length === 0) {
      return null
    }

    const page = response.results[0]
    const post: BlogPost = {
      id: page.id,
      title: getPlainText(page.properties.Name),
      slug: getPlainText(page.properties.Slug),
      summary: getPlainText(page.properties.Summary),
      publishedDate: getDate(page.properties["Published Date"]),
      category: getSelect(page.properties.Category),
      thumbnail: getFiles(page.properties.Files),
    }

    console.log(`[v0] Successfully fetched post: ${post.title}`)
    return post
  } catch (error) {
    console.error("[v0] Error fetching post by slug:", error)
    return null
  }
}

/**
 * Notion 페이지의 블록 콘텐츠를 Markdown으로 변환합니다
 */
export async function getPageContent(pageId: string): Promise<string> {
  console.log(`[v0] Fetching page content for: ${pageId}`)

  if (!NOTION_API_KEY) {
    return getMockContent()
  }

  try {
    // Notion 블록을 가져옵니다
    const blocks = await getBlocks(pageId)

    // 블록을 Markdown으로 변환
    const markdown = await blocksToMarkdown(blocks)

    console.log(`[v0] Successfully converted page content to markdown`)
    return markdown
  } catch (error) {
    console.error("[v0] Error fetching page content:", error)
    return getMockContent()
  }
}

/**
 * 페이지의 모든 블록을 재귀적으로 가져옵니다
 */
async function getBlocks(blockId: string): Promise<any[]> {
  const allBlocks: any[] = []
  let cursor: string | undefined

  do {
    const response = await notionFetch(`/blocks/${blockId}/children?${cursor ? `start_cursor=${cursor}` : ""}`, {
      method: "GET",
    })

    if (!response) break

    allBlocks.push(...response.results)
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return allBlocks
}

/**
 * Notion 블록을 Markdown으로 변환합니다
 */
async function blocksToMarkdown(blocks: any[]): Promise<string> {
  const markdown: string[] = []

  for (const block of blocks) {
    const blockMarkdown = await blockToMarkdown(block)
    if (blockMarkdown) {
      markdown.push(blockMarkdown)
    }
  }

  return markdown.join("\n\n")
}

/**
 * 개별 블록을 Markdown으로 변환합니다
 */
async function blockToMarkdown(block: any): Promise<string> {
  const type = block.type
  const content = block[type]

  // 텍스트 추출
  const getText = (richText: any[]) => {
    if (!richText) return ""
    return richText
      .map((text: any) => {
        let result = text.plain_text
        if (text.annotations?.bold) result = `**${result}**`
        if (text.annotations?.italic) result = `*${result}*`
        if (text.annotations?.code) result = `\`${result}\``
        if (text.href) result = `[${result}](${text.href})`
        return result
      })
      .join("")
  }

  switch (type) {
    case "paragraph":
      return getText(content.rich_text)

    case "heading_1":
      return `# ${getText(content.rich_text)}`

    case "heading_2":
      return `## ${getText(content.rich_text)}`

    case "heading_3":
      return `### ${getText(content.rich_text)}`

    case "bulleted_list_item":
      return `- ${getText(content.rich_text)}`

    case "numbered_list_item":
      return `1. ${getText(content.rich_text)}`

    case "code":
      const code = getText(content.rich_text)
      const language = content.language || ""
      return `\`\`\`${language}\n${code}\n\`\`\``

    case "quote":
      return `> ${getText(content.rich_text)}`

    case "image":
      const imageUrl = content.file?.url || content.external?.url
      const caption = content.caption ? getText(content.caption) : "image"
      return `![${caption}](${imageUrl})`

    case "divider":
      return "---"

    default:
      return ""
  }
}

/**
 * 개발/테스트용 목 데이터
 */
function getMockPosts(): BlogPost[] {
  return [
    {
      id: "1",
      title: "Notion Blog 시작하기",
      slug: "getting-started-with-notion-blog",
      summary: "Notion을 CMS로 사용하는 블로그 시스템을 구축하는 방법을 알아봅니다.",
      publishedDate: "2024-01-15",
      category: "Tutorial",
      thumbnail: "/notion-blog-tutorial.jpg",
    },
    {
      id: "2",
      title: "Next.js 14 App Router 완벽 가이드",
      slug: "nextjs-14-app-router-guide",
      summary: "Next.js 14의 새로운 App Router를 활용하여 현대적인 웹 애플리케이션을 만드는 방법",
      publishedDate: "2024-01-10",
      category: "Development",
      thumbnail: "/nextjs-app-router.png",
    },
    {
      id: "3",
      title: "TypeScript 베스트 프랙티스",
      slug: "typescript-best-practices",
      summary: "실무에서 바로 적용할 수 있는 TypeScript 활용 팁과 패턴들을 소개합니다.",
      publishedDate: "2024-01-05",
      category: "Programming",
      thumbnail: "/typescript-code.png",
    },
  ]
}

function getMockContent(): string {
  return `# 환영합니다!

이것은 데모 콘텐츠입니다. Notion API 연동을 완료하면 실제 콘텐츠가 표시됩니다.

## 설정 방법

1. Notion에서 Integration을 생성하세요
2. Database ID를 복사하세요
3. \`.env.local\` 파일에 환경 변수를 설정하세요

\`\`\`bash
NOTION_API_KEY="your_api_key_here"
NOTION_DATABASE_ID="your_database_id_here"
\`\`\`

## 기능

- **Markdown 지원**: 모든 Notion 블록이 Markdown으로 변환됩니다
- **SEO 최적화**: 동적 메타 태그와 sitemap 생성
- **반응형 디자인**: 모든 디바이스에서 완벽하게 작동

더 자세한 내용은 README.md 파일을 참고하세요!`
}

/**
 * 모든 게시글의 slug 목록을 반환합니다 (sitemap 생성용)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts()
  return posts.map((post) => post.slug)
}
