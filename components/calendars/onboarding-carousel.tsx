"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Calendar, Users, Mail, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  {
    icon: Calendar,
    title: "Share Your Calendar Page",
    description: "Customize and share your beautiful Calendar showcasing your upcoming events. Guests can browse your schedule and subscribe for updates.",
  },
  {
    icon: Users,
    title: "Work with Your Team",
    description: "Easily add your teammates as calendar admins. They'll have manage access to events managed by the calendar.",
  },
  {
    icon: Sparkles,
    title: "Highlight Community Events",
    description: "Your Calendar can feature events from other Calendars. You can even include events hosted on other websites.",
  },
  {
    icon: Mail,
    title: "Send Newsletters",
    description: "As guests subscribe to your Calendar, you can send them newsletters to keep them in the loop.",
  },
]

interface OnboardingCarouselProps {
  onComplete: () => void
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border border-border p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              {slide.description}
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext} size="lg" className="gap-2">
              {currentSlide < slides.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                "Create Calendar"
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
