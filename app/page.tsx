import { Button } from '@/components/ui/button'
import { FileText, Users, Cloud, ArrowRight, MessageSquare, History, Download } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Scribe" className="h-8 w-8 rounded" />
            <span className="text-2xl font-bold text-neutral-900">Scribe</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-neutral-700 hover:text-blue-600 hover:bg-blue-50">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container px-4 py-24 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Collaborative document editing made simple
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-neutral-600">
            Create, edit, and share documents with your team. Rich text formatting, comments, version history, and exports—all in one place.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth/sign-up">
                Start writing for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-neutral-300 text-neutral-700 hover:bg-neutral-100">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-neutral-200 bg-white py-24">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900">
              Everything you need to collaborate
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Rich Text Editing</h3>
                <p className="text-neutral-600">
                  Format your documents with bold, italic, underline, headings, and lists. Everything saves automatically.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Easy Sharing</h3>
                <p className="text-neutral-600">
                  Share documents with anyone by email. Control permissions with view-only or edit access.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                  <Cloud className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">File Import</h3>
                <p className="text-neutral-600">
                  Import .txt, .md, .doc, and .docx files directly. Your content converts to editable documents.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-amber-100 p-3">
                  <MessageSquare className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Comments & Suggestions</h3>
                <p className="text-neutral-600">
                  Add comments and suggestions directly in documents. Track status and resolve feedback efficiently.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                  <History className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Version History</h3>
                <p className="text-neutral-600">
                  Track all changes. View previous versions and see who made updates and when.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">Export Options</h3>
                <p className="text-neutral-600">
                  Export to PDF, Markdown, or JSON. Perfect for archiving or integrating with other tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-xl text-neutral-600">
            Join Scribe today and start creating and sharing documents with your team. It&apos;s free to get started.
          </p>
          <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
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
