/**
 * 블로그 홈페이지 - 게시글 목록을 표시합니다
 * Published가 체크된 게시글을 Published Date 기준 최신순으로 정렬하여 보여줍니다
 */

import Link from "next/link"
import Image from "next/image"
import { getPublishedPosts } from "@/lib/notion"
import type { Metadata } from "next"

// 페이지 메타데이터 설정 (SEO)
export const metadata: Metadata = {
  title: "Home | Notion Blog",
  description: "Notion을 CMS로 사용하는 현대적인 블로그입니다.",
}

export default async function HomePage() {
  // Notion에서 게시글 목록 가져오기
  const posts = await getPublishedPosts()

  return (
    <main className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-balance">Notion Blog</h1>
          <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl mx-auto text-balance">
            Notion을 CMS로 활용하는 현대적이고 SEO에 최적화된 블로그입니다
          </p>
        </div>
      </section>

      {/* 게시글 목록 */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">아직 게시된 글이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/blog/${post.slug}`}>
                    {/* 썸네일 이미지 */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                    </div>

                    {/* 게시글 정보 */}
                    <div className="p-5">
                      {/* 카테고리 */}
                      {post.category && (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                          {post.category}
                        </span>
                      )}

                      {/* 제목 */}
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 text-balance">
                        {post.title}
                      </h2>

                      {/* 요약 */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 text-pretty">{post.summary}</p>

                      {/* 발행일 */}
                      {post.publishedDate && (
                        <time className="text-xs text-muted-foreground" dateTime={post.publishedDate}>
                          {new Date(post.publishedDate).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
