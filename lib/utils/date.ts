/**
 * Date Utility Functions
 * Helpers for formatting dates consistently across the blog
 */

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function isRecentPost(date: string | Date): boolean {
  const postDate = new Date(date)
  const now = new Date()
  const daysDifference = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24))
  return daysDifference <= 7 // Posts from last 7 days are "recent"
}
