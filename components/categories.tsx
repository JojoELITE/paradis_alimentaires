"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import {
  Apple, Carrot, Beef, Fish, Milk, ShoppingBag, Coffee, Cookie,
  LucideIcon
} from "lucide-react"

// Map des noms d'icônes vers les composants Lucide
const iconMap: Record<string, LucideIcon> = {
  Apple: Apple,
  Carrot: Carrot,
  Beef: Beef,
  Fish: Fish,
  Milk: Milk,
  ShoppingBag: ShoppingBag,
  Coffee: Coffee,
  Cookie: Cookie,
}

interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  icon_name: string | null
  description: string | null
  product_count: number
  sort_order: number
  is_active: boolean
  subCategories?: Category[]
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://ecomerce-api-1-dp0w.onrender.com/api/categories')

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()

        if (data.success === true) {
          setCategories(data.data || [])
          setError(null)
        } else {
          throw new Error(data.message || 'Failed to fetch categories')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Catégories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chargement des catégories...
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Catégories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre large sélection de produits frais et de qualité
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground"> aucune catégorie disponible pour le moment.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-primary hover:underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Catégories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre large sélection de produits frais et de qualité
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Revenez bientôt pour découvrir notre sélection de produits frais et de qualité.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Catégories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre large sélection de produits frais et de qualité, soigneusement sélectionnés pour vous
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories
            .filter(category => category.is_active !== false)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((category) => {
              const IconComponent = category.icon_name ? iconMap[category.icon_name] : ShoppingBag

              return (
                <Link href={`/categories/${category.name}`} key={category.id} className="group">
                  <Card
                    className={cn(
                      "overflow-hidden border-none shadow-md transition-all duration-300 group-hover:shadow-lg h-full",
                      "transform group-hover:-translate-y-1"
                    )}
                  >
                    <CardContent className="p-0 relative">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={category.slug}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Icon overlay */}
                        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-full">
                          {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-xl">{category.name}</h3>
                        {category.product_count > 0 && (
                          <p className="text-sm text-white/80 mt-1">{category.product_count} produits</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
        </div>
      </div>
    </section>
  )
}