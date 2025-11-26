/**
 * robots.txt 생성
 * 검색 엔진 크롤러에게 사이트맵 위치와 크롤링 규칙을 알려줍니다
 */

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
