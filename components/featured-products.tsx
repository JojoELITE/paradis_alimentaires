"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { useEffect, useState } from "react"

interface Product {
  id: string
  name: string
  price: string
  oldPrice?: string | null
  imageUrl: string | null
  category: string | null
  isNew: boolean
  isOnSale: boolean
  description?: string
  stock?: number
  rating?: number
  reviewsCount?: number
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://ecomerce-api-aotc.onrender.com/api/products"
        )

        if (!res.ok) {
          throw new Error("Erreur API")
        }

        const data = await res.json()

        console.log("API:", data)

        if (data.success) {
          setProducts(data.data || [])
        }
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // ✅ Transformation des données
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    image: product.imageUrl || "/images/placeholder.png",
    category: product.category || "Produits",
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    description: product.description,
    stock: product.stock,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
  }))

  const featuredProducts = formattedProducts.slice(0, 12)

  // ✅ Loading
  if (loading) {
    return (
      <section className="py-16 text-center">
        <p>Chargement des produits...</p>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Produits Populaires
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos meilleurs produits disponibles sur la plateforme
          </p>
        </div>

        {/* LISTE PRODUITS */}
        {featuredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p>Aucun produit disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* BOUTON */}
        <div className="mt-12 text-center">
          <Link href="/produits">
            <Button>Voir tous les produits</Button>
          </Link>
        </div>

      </div>
    </section>
  )
}
