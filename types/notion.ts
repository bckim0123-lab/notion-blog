/**
 * TypeScript type definitions for Notion blog
 */

export interface BlogPostMeta {
  id: string
  title: string
  slug: string
  summary: string
  publishedDate: string
  category: string
  thumbnail: string
}

export interface BlogPostFull extends BlogPostMeta {
  content: string
}

export interface NotionDatabaseSchema {
  Title: "title"
  Slug: "rich_text"
  Summary: "rich_text"
  "Published Date": "date"
  Category: "select"
  Thumbnail: "files"
  Published: "checkbox"
}
