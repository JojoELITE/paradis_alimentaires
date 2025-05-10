"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Sophie Martin",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "J'adore faire mes courses chez Paradis Alimentaire. Les produits sont toujours frais et de qualité exceptionnelle. Le service client est également impeccable !",
  },
  {
    id: 2,
    name: "Thomas Dubois",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "Excellente sélection de produits frais. Je recommande particulièrement les fruits et légumes bio qui sont vraiment délicieux.",
  },
  {
    id: 3,
    name: "Marie Leroy",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "La livraison est toujours ponctuelle et les produits sont bien emballés. Je suis cliente depuis plus d'un an et je n'ai jamais été déçue.",
  },
  {
    id: 4,
    name: "Pierre Moreau",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Les prix sont très compétitifs et la qualité est au rendez-vous. Je recommande vivement Paradis Alimentaire à tous mes amis.",
  },
  {
    id: 5,
    name: "Julie Bernard",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "J'apprécie particulièrement les promotions régulières et la fraîcheur des produits. Un vrai paradis pour les gourmets !",
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setVisibleTestimonials([activeIndex])
      } else if (width < 1024) {
        setVisibleTestimonials([activeIndex, (activeIndex + 1) % testimonials.length])
      } else {
        setVisibleTestimonials([
          activeIndex,
          (activeIndex + 1) % testimonials.length,
          (activeIndex + 2) % testimonials.length,
        ])
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(interval)
    }
  }, [activeIndex])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de nos clients satisfaits qui nous font confiance au quotidien
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={cn(
                  "min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] transition-all duration-500 ease-out",
                  visibleTestimonials.includes(index)
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full absolute",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeIndex === index ? "bg-primary w-8" : "bg-muted hover:bg-muted-foreground/50",
                )}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
