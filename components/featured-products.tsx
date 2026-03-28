"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  old_price: number | null
  image_url: string | null
  category: string | null
  is_new: boolean
  is_on_sale: boolean
  description?: string
  stock?: number
  rating?: number
  reviews_count?: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://ecomerce-api-1-dp0w.onrender.com/api/products')
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        
        // Vérifier si la réponse est valide
        if (data.success === true) {
          setProducts(data.data || [])
          setError(null)
        } else {
          throw new Error(data.message || 'Failed to fetch products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        // Ne pas afficher d'erreur si c'est juste un problème réseau temporaire
        // setError(err instanceof Error ? err.message : 'An error occurred')
        setError(null) // On ignore l'erreur pour l'instant
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Transformer les données de l'API
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.old_price,
    image: product.image_url || "/images/placeholder.png",
    category: product.category || "Produits",
    isNew: product.is_new,
    isOnSale: product.is_on_sale,
    description: product.description,
    stock: product.stock,
    rating: product.rating,
    reviewsCount: product.reviews_count,
  }))

  // Limiter à 12 produits
  const featuredProducts = formattedProducts.slice(0, 12)

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produits Populaires</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chargement des produits...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produits Populaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos produits les plus appréciés par nos clients, sélectionnés avec soin pour leur qualité
            exceptionnelle
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Revenez bientôt pour découvrir notre sélection de produits frais et de qualité.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/produits">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}