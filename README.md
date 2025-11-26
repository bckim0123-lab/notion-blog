# Notion-Powered Blog

A fully functional, SEO-optimized blog built with Next.js 14+ and Notion as a CMS.

## Features

- 🎨 Responsive design (mobile, tablet, desktop)
- 📝 Notion as CMS - no database setup required
- 🔍 SEO optimized with dynamic meta tags
- 🚀 Automatic sitemap.xml and robots.txt generation
- ⚡ Server-side rendering for fast page loads
- 🎯 Markdown rendering with react-markdown
- 📱 Mobile-first design with Tailwind CSS

## Notion Database Setup

1. Create a new Notion database with the following properties:
   - **Title** (Title) - Post title
   - **Slug** (Text) - URL-friendly slug (e.g., "my-first-post")
   - **Summary** (Text) - Short description for homepage
   - **Published Date** (Date) - Publication date
   - **Category** (Select) - Post category (e.g., Technology, Design)
   - **Thumbnail** (Files & media) - Featured image URL
   - **Published** (Checkbox) - Controls post visibility

2. Share your database with your Notion integration
3. Copy the database ID from the URL

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Project Structure

- `/app` - Next.js 14+ app directory
  - `/page.tsx` - Homepage with post list
  - `/blog/[slug]/page.tsx` - Dynamic blog post pages
- `/components` - Reusable React components
  - `header.tsx` - Site header
  - `footer.tsx` - Site footer
  - `blog-card.tsx` - Post preview card
- `/lib` - Utility functions
  - `notion.ts` - Notion API integration
- `/types` - TypeScript type definitions

## Deployment

Deploy to Vercel with one click:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!
