/**
 * Blog Post Card Component
 * Displays post preview with thumbnail, title, summary, and metadata
 */

import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/notion"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  // Format date for display
  const formattedDate = new Date(post.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and Date */}
          <div className="mb-3 flex items-center gap-3 text-sm">
            {post.category && (
              <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">{post.category}</span>
            )}
            <time dateTime={post.publishedDate} className="text-muted-foreground">
              {formattedDate}
            </time>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-balance text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
            {post.title}
          </h2>

          {/* Summary */}
          <p className="text-pretty text-muted-foreground line-clamp-3">{post.summary}</p>

          {/* Read More */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
            <span>Read more</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}
