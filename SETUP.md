# Notion Blog Setup Guide

Follow these steps to get your Notion-powered blog up and running.

## 1. Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Give it a name (e.g., "My Blog Integration")
4. Select the workspace where your blog database will live
5. Click **"Submit"**
6. Copy the **Internal Integration Token** (starts with `secret_`)

## 2. Create Your Notion Database

1. In Notion, create a new page
2. Add a **Database - Table** block
3. Name it "Blog Posts" (or whatever you prefer)

### Required Database Properties

Add these exact properties to your database:

| Property Name | Property Type | Description |
|--------------|---------------|-------------|
| **Title** | Title | The post title (default property) |
| **Slug** | Text | URL-friendly slug (e.g., "my-first-post") |
| **Summary** | Text | Short description for the homepage |
| **Published Date** | Date | When the post was published |
| **Category** | Select | Post category (Technology, Design, etc.) |
| **Thumbnail** | Files & media | Featured image |
| **Published** | Checkbox | Controls if post is visible on site |

### Example Database Entry

- **Title:** "Getting Started with Next.js"
- **Slug:** "getting-started-nextjs"
- **Summary:** "Learn how to build modern web apps with Next.js"
- **Published Date:** 2024-01-15
- **Category:** Technology
- **Thumbnail:** (Upload an image or paste a URL)
- **Published:** ✓ (checked)

## 3. Share Database with Integration

1. Open your Notion database page
2. Click the **"..."** menu in the top right
3. Scroll down and click **"Add connections"**
4. Find and select your integration
5. Click **"Confirm"**

## 4. Get Your Database ID

Your database ID is in the URL of your Notion database page:

\`\`\`
https://www.notion.so/[workspace]/[DATABASE_ID]?v=[view_id]
\`\`\`

Copy the `DATABASE_ID` part (it's a 32-character string).

## 5. Configure Environment Variables

Create a `.env.local` file in your project root:

\`\`\`bash
# Notion Configuration
NOTION_API_KEY=secret_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

For production (Vercel):
- Go to your project settings
- Navigate to Environment Variables
- Add the same variables above
- Update `NEXT_PUBLIC_SITE_URL` to your production domain

## 6. Install Dependencies & Run

\`\`\`bash
# Install dependencies (if not already installed)
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your blog!

## 7. Test Your Setup

1. **Check Homepage:** Should display your published posts
2. **Click a Post:** Should show full content rendered from Notion
3. **Check SEO:** View page source to verify meta tags
4. **Test Sitemap:** Visit `/sitemap.xml`
5. **Test Robots:** Visit `/robots.txt`

## Troubleshooting

### No posts showing up?
- Verify the **Published** checkbox is checked in Notion
- Ensure all required properties exist in your database
- Check that the integration has access to the database
- Verify environment variables are set correctly

### "Error fetching posts from Notion"?
- Double-check your `NOTION_API_KEY`
- Verify the integration has access to the database
- Make sure `NOTION_DATABASE_ID` is correct

### Images not loading?
- Notion images expire after a few hours
- Consider uploading images to a CDN or using external URLs
- Or use Vercel Blob for permanent image storage

## Content Writing Tips

1. **Write in Notion:** Use any Notion blocks (headings, lists, images, code, etc.)
2. **Use the Slug wisely:** Make it URL-friendly (lowercase, hyphens, no spaces)
3. **Add compelling summaries:** These appear on the homepage
4. **Choose good thumbnails:** They make your posts stand out
5. **Uncheck Published:** To save drafts without publishing

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

Your blog will automatically rebuild when you:
- Push code changes to GitHub
- After 1 hour (revalidation period)

To trigger manual rebuilds when content changes, consider adding Vercel Deploy Hooks.

## Next Steps

- Customize the design in `app/globals.css`
- Update the Header logo and links in `components/header.tsx`
- Modify the Footer content in `components/footer.tsx`
- Add Google Analytics or other tracking
- Set up a custom domain
- Add a newsletter signup form
- Implement search functionality

## Need Help?

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Read the [Notion API Docs](https://developers.notion.com)
- Review the [README.md](./README.md) file

Happy blogging!
