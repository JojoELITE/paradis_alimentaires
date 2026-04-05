"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const API_BASE = "https://ecomerce-api-aotc.onrender.com/api"

interface Pub {
  id: string
  name: string
  description: string
  imageUrl: string
  displayDuration: number
  startDate: string | null
  endDate: string | null
  isActive: boolean
  priority: number
  targetUrl: string | null
  merchantId: string | null
  createdAt: string
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slides, setSlides] = useState<any[]>([])

  // 🔥 Filtrer les pubs actives + dates valides
  const isValidPub = (pub: Pub) => {
    const now = new Date()

    if (!pub.isActive) return false

    if (pub.startDate && new Date(pub.startDate) > now) return false
    if (pub.endDate && new Date(pub.endDate) < now) return false

    return true
  }

  // 🔥 Fetch + transformation
  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch(`${API_BASE}/pubs`)
        const result = await response.json()

        const pubs: Pub[] = result?.data?.data || []

        const validPubs = pubs
          .filter(isValidPub)
          .sort((a, b) => a.priority - b.priority)

        const pubSlides = validPubs.map((pub) => ({
          id: pub.id,
          title: pub.name,
          description: pub.description,
          image: pub.imageUrl || "/placeholder.svg",
          duration: pub.displayDuration || 5,
          cta: "Découvrir",
          link: pub.targetUrl || "/produits",
        }))

        setSlides(pubSlides)
      } catch (error) {
        console.error("Erreur lors du chargement des pubs:", error)
      }
    }

    fetchPubs()
  }, [])

  // 🔁 Next slide
  const nextSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return
    setIsAnimating(true)

    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    )

    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, slides.length])

  // 🔁 Prev slide
  const prevSlide = useCallback(() => {
    if (isAnimating || slides.length === 0) return
    setIsAnimating(true)

    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    )

    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, slides.length])

  // ⏱️ Auto slide dynamique
  useEffect(() => {
    if (slides.length === 0) return

    const duration = slides[currentSlide]?.duration || 5

    const interval = setInterval(() => {
      nextSlide()
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [currentSlide, slides, nextSlide])

  if (slides.length === 0) {
    return null
  }

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 ease-in-out",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />

          {/* Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          {/* Content */}
          <div className="relative z-20 h-full flex flex-col justify-center container mx-auto px-4">
            <div className="max-w-xl space-y-6">
              <h1
                className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-700",
                  currentSlide === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: "200ms" }}
              >
                {slide.title}
              </h1>

              <p
                className={cn(
                  "text-lg md:text-xl text-white/90 transition-all duration-700",
                  currentSlide === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: "400ms" }}
              >
                {slide.description}
              </p>

              <div
                className={cn(
                  "transition-all duration-700",
                  currentSlide === index
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: "600ms" }}
              >
                <Link href={slide.link}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ⬅️ Prev */}
      <div className="absolute bottom-1/2 left-4 z-30 transform translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 hover:bg-black/50 text-white h-10 w-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* ➡️ Next */}
      <div className="absolute bottom-1/2 right-4 z-30 transform translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/30 hover:bg-black/50 text-white h-10 w-10"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* 🔘 Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentSlide === index
                ? "bg-primary w-8"
                : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => {
              setIsAnimating(true)
              setCurrentSlide(index)
              setTimeout(() => setIsAnimating(false), 500)
            }}
          />
        ))}
      </div>
    </section>
  )
}