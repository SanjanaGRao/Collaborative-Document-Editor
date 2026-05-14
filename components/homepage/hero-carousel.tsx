'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, Users, History, Download, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    id: 1,
    title: 'Welcome to Scribe',
    description: 'The collaborative document editor built for modern teams — write, share, and ship faster.',
    icon: null,
    isLogo: true,
  },
  {
    id: 2,
    title: 'Rich Text Editing',
    description: 'Format documents with bold, italic, headings, lists and more. Everything auto-saves in real time.',
    icon: FileText,
    isLogo: false,
  },
  {
    id: 3,
    title: 'Collaborate Instantly',
    description: 'Share documents by email and control access with granular view-only or edit permissions.',
    icon: Users,
    isLogo: false,
  },
  {
    id: 4,
    title: 'Full Version History',
    description: 'Every manual save creates a snapshot. See who changed what and roll back with one click.',
    icon: History,
    isLogo: false,
  },
  {
    id: 5,
    title: 'Export Anywhere',
    description: 'Download as PDF, Markdown, or JSON for seamless integration with any other tool.',
    icon: Download,
    isLogo: false,
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoPlay])

  const next = () => { setCurrent((prev) => (prev + 1) % slides.length); setAutoPlay(false) }
  const prev = () => { setCurrent((prev) => (prev - 1 + slides.length) % slides.length); setAutoPlay(false) }
  const goTo = (i: number) => { setCurrent(i); setAutoPlay(false) }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card">
      {/* Purple glow accent */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.6 0.22 290 / 0.15), transparent)' }} />

      {/* Slide container */}
      <div className="relative h-[420px] md:h-[520px]">
        {slides.map((slide, index) => {
          const Icon = slide.icon
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 flex items-center justify-center px-6 md:px-16 transition-opacity duration-700 ${
                index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col items-center text-center max-w-2xl">
                {slide.isLogo ? (
                  <img
                    src="/scribe-logo.png"
                    alt="Scribe"
                    className="mb-8 h-28 w-auto md:h-36 drop-shadow-2xl"
                  />
                ) : Icon ? (
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                ) : null}

                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
                  {slide.title}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
                  {slide.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Nav buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/60 hover:bg-background/90 border border-border backdrop-blur"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/60 hover:bg-background/90 border border-border backdrop-blur"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-7 h-2 bg-primary'
                : 'w-2 h-2 bg-primary/30 hover:bg-primary/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
