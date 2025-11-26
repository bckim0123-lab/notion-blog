/**
 * 동적 sitemap.xml 생성
 * 모든 게시글을 자동으로 sitemap에 포함시킵니다
 */

import type { MetadataRoute } from "next"
import { getAllPostSlugs } from "@/lib/notion"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ]

  // 블로그 게시글 페이지들
  const postSlugs = await getAllPostSlugs()
  const blogPages = postSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages]
}
