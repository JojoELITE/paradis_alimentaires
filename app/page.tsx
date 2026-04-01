"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import Categories from "@/components/categories"
import Promotions from "@/components/promotions"
import Newsletter from "@/components/newsletter"
import Testimonials from "@/components/testimonials"
import Banner from "@/components/banner"
import MoyensPaiement from "@/components/moyens-paiement"

interface Pub {
  id: string
  name: string
  description: string
  imageUrl: string
  priority: number
  targetUrl: string | null
  isActive: boolean
}

export default function Home() {
  const [firstBanner, setFirstBanner] = useState<Pub | null>(null)
  const [lastBanner, setLastBanner] = useState<Pub | null>(null)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/pubs")
        const data = await res.json()

        if (!data.success || !data.data?.data) return

        // Filtrer les pubs actives
        const activePubs: Pub[] = data.data.data.filter((p: Pub) => p.isActive)

        // Première bannière priorité 2
        const first = activePubs.find((p) => p.priority === 2)
        setFirstBanner(first || null)

        // Dernière bannière priorité 3
        const last = [...activePubs].reverse().find((p) => p.priority === 3)
        setLastBanner(last || null)
      } catch (error) {
        console.error("Erreur lors du fetch des pubs:", error)
      }
    }

    fetchBanners()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-24 overflow-x-hidden">
      <div className="w-full">
        <Hero />
        <Categories />
        <FeaturedProducts />

        {firstBanner && (
          <div className="container mx-auto px-4 py-8">
            <Banner
              title={firstBanner.name}
              description={firstBanner.description}
              buttonText="Découvrir"
              buttonLink={firstBanner.targetUrl || "/produits"}
              image={firstBanner.imageUrl || "/images/placeholder.jpeg"}
              bgColor="bg-navy-blue"
              position="left"
            />
          </div>
        )}

        <Promotions />

        {lastBanner && (
          <div className="container mx-auto px-4 py-8">
            <Banner
              title={lastBanner.name}
              description={lastBanner.description}
              buttonText="Découvrir"
              buttonLink={lastBanner.targetUrl || "/produits"}
              image={lastBanner.imageUrl || "/images/placeholder.jpeg"}
              bgColor="bg-logo-red"
              position="right"
            />
          </div>
        )}

        <Testimonials />
        <MoyensPaiement />
        <Newsletter />
      </div>
    </main>
  )
}