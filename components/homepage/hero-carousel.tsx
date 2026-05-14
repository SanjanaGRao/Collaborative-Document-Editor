'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    id: 1,
    title: 'Welcome to Scribe',
    description: 'The collaborative document editor for modern teams',
    image: '/scribe-logo.png',
  },
  {
    id: 2,
    title: 'Rich Text Editing',
    description: 'Format documents with bold, italic, headings, and more. Everything saves automatically.',
    image: '/scribe-logo.png',
  },
  {
    id: 3,
    title: 'Collaborate in Real-time',
    description: 'Share documents with your team and control access with granular permissions.',
    image: '/scribe-logo.png',
  },
  {
    id: 4,
    title: 'Track Every Change',
    description: 'Access full version history to see who changed what and when.',
    image: '/scribe-logo.png',
  },
  {
    id: 5,
    title: 'Export Anywhere',
    description: 'Export to PDF, Markdown, or JSON for seamless integration.',
    image: '/scribe-logo.png',
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

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrent(index)
    setAutoPlay(false)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Carousel Container */}
      <div className="relative h-96 md:h-[500px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex h-full items-center justify-center px-4 md:px-8">
              <div className="flex flex-col items-center text-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="mb-8 h-32 w-auto md:h-48"
                />
                <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-lg text-muted-foreground">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur hover:bg-background"
        onClick={prev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur hover:bg-background"
        onClick={next}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === current
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary/30 hover:bg-primary/50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
