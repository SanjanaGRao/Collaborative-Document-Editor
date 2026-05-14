import { Button } from '@/components/ui/button'
import { FileText, Users, Cloud, ArrowRight, MessageSquare, History, Download } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Scribe" className="h-8 w-8 rounded" />
            <span className="text-xl font-bold">Scribe</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container px-4 py-24 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Collaborative document editing made simple
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Create, edit, and share documents with your team. Rich text formatting, comments, version history, and exports—all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Start writing for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything you need to collaborate
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Rich Text Editing</h3>
                <p className="text-muted-foreground">
                  Format your documents with bold, italic, underline, headings, and lists. Everything saves automatically.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Easy Sharing</h3>
                <p className="text-muted-foreground">
                  Share documents with anyone by email. Control permissions with view-only or edit access.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">File Import</h3>
                <p className="text-muted-foreground">
                  Import .txt, .md, .doc, and .docx files directly. Your content converts to editable documents.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3">
                  <MessageSquare className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Comments & Suggestions</h3>
                <p className="text-muted-foreground">
                  Add comments and suggestions directly in documents. Track status and resolve feedback efficiently.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3">
                  <History className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Version History</h3>
                <p className="text-muted-foreground">
                  Track all changes. View previous versions and see who made updates and when.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-lg border bg-background p-6">
                <div className="mb-4 inline-flex rounded-lg bg-green-500/10 p-3">
                  <Download className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Export Options</h3>
                <p className="text-muted-foreground">
                  Export to PDF, Markdown, or JSON. Perfect for archiving or integrating with other tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join Scribe today and start creating and sharing documents with your team. It&apos;s free to get started.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">
              Create your free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Scribe" className="h-5 w-5 rounded" />
            <span>Scribe</span>
          </div>
          <p>Built for the Ajaia Technical Assessment</p>
        </div>
      </footer>
    </div>
  )
}
