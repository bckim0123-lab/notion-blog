/**
 * 게시글 상세 페이지
 * Slug를 기반으로 동적 라우팅을 구현하고, Notion 콘텐츠를 렌더링합니다
 */

import { notFound } from "next/navigation"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { getPostBySlug, getPageContent, getAllPostSlugs } from "@/lib/notion"
import type { Metadata } from "next"
import "./markdown-styles.css"

// 동적 라우트에 필요한 모든 slug 생성 (빌드 시)
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// 동적 메타데이터 생성 (SEO)
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Notion Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedDate,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  // 게시글 정보 가져오기
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // 게시글 콘텐츠 가져오기
  const content = await getPageContent(post.id)

  return (
    <main className="min-h-screen">
      <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* 게시글 헤더 */}
        <header className="mb-8">
          {/* 카테고리 */}
          {post.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
              {post.category}
            </span>
          )}

          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.publishedDate && (
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        </header>

        {/* 썸네일 이미지 */}
        {post.thumbnail && (
          <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden bg-muted">
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* 게시글 본문 (Markdown 렌더링) */}
        <div className="prose prose-slate dark:prose-invert max-w-none markdown-content">
          <ReactMarkdown
            components={{
              // 코드 블록 신택스 하이라이팅
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              // 이미지 최적화
              img({ src, alt }) {
                if (!src) return null
                return (
                  <span className="block relative w-full aspect-video my-6">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={alt || ""}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  </span>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
