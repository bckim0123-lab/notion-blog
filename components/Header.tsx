/**
 * 블로그 헤더 컴포넌트
 * 네비게이션과 로고를 포함합니다
 */

import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors">
          <span className="text-2xl">📝</span>
          <span>Notion Blog</span>
        </Link>

        {/* 네비게이션 메뉴 */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            홈
          </Link>
          <Link href="/#posts" className="text-sm font-medium hover:text-primary transition-colors">
            게시글
          </Link>
        </div>
      </nav>
    </header>
  )
}
