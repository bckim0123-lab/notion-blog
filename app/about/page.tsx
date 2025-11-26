/**
 * About Page
 * Static page with information about the blog
 */

import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about our blog and what we write about.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">About My Blog</h1>

          <div className="prose prose-lg dark:prose-invert">
            <p className="text-pretty text-xl text-muted-foreground">
              Welcome! This blog is a space where I share my thoughts and insights on technology, design, and
              development.
            </p>

            <h2 className="mt-12 text-2xl font-bold">What You'll Find Here</h2>
            <p>
              I write about topics that I'm passionate about, including web development, user experience design,
              emerging technologies, and the intersection of creativity and code.
            </p>

            <h2 className="mt-12 text-2xl font-bold">Built With Modern Tools</h2>
            <p>
              This blog is built with Next.js 14+ and uses Notion as a content management system. This approach combines
              the power of a modern React framework with the simplicity of managing content in Notion.
            </p>

            <h2 className="mt-12 text-2xl font-bold">Get In Touch</h2>
            <p>
              I'd love to hear from you! Whether you have questions, feedback, or just want to say hi, feel free to
              reach out through the contact page.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
