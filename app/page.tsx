import { Button } from '@/components/ui/button'
import { FileText, Users, Cloud, ArrowRight, MessageSquare, History, Download } from 'lucide-react'
import { HeroCarousel } from '@/components/homepage/hero-carousel'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src="/scribe-logo.png" alt="Scribe" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">Scribe</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Carousel */}
        <section className="container px-4 py-10 md:py-14">
          <HeroCarousel />
        </section>

        {/* Feature headline */}
        <section className="py-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground text-balance">Everything you need to collaborate</h2>
          <p className="text-muted-foreground">Powerful features built for modern teams</p>
        </section>

        {/* Features grid */}
        <section className="border-t border-border bg-card/40 py-20">
          <div className="container px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 border border-primary/20">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Rich Text Editing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Format documents with bold, italic, underline, headings, and lists. Everything saves automatically.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 border border-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Easy Sharing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Share documents by email with view-only or edit access. Full permission control.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 border border-primary/20">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">File Import</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Import .txt, .md, .doc, and .docx files. Content converts to editable documents instantly.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 border border-primary/20">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Comments & Suggestions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add comments directly in documents. Track status and resolve feedback efficiently.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 border border-primary/20">
                  <History className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Version History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every save creates a snapshot. See who changed what and restore any version.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 border border-primary/20">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Export Options</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Export to PDF, Markdown, or JSON. Perfect for archiving or integrating with other tools.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container px-4 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground text-balance">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join Scribe today and start creating and sharing documents with your team. It&apos;s free to get started.
          </p>
          <Button size="lg" asChild className="px-8">
            <Link href="/auth/sign-up">
              Create your free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/scribe-logo.png" alt="Scribe" className="h-6 w-auto" />
            <span className="font-medium text-foreground">Scribe</span>
          </div>
          <p>Built for the Ajaia Technical Assessment</p>
        </div>
      </footer>
    </div>
  )
}
