"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: number
  name: string
  price: number
  description?: string
  stock?: number
  image_url?: string
  user_id: number
  created_at: string
  updated_at: string
  category?: string
  is_new?: boolean
  is_on_sale?: boolean
  old_price?: number | null
}

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://ecomerce-api-1-dp0w.onrender.com/api/products')
        
        if (!res.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await res.json()
         console.log(data )
        setProducts(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Transformer les données pour ProductCard
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.old_price || null,
    image: product.image_url || "/images/placeholder.png",
    category: product.category || "Produits",
    isNew: product.is_new || false,
    isOnSale: product.is_on_sale || false,
  }))

  const featuredProduct = products[0]

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between pt-32">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement des produits...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between pt-32">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Erreur: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-32">
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nos Produits</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre large sélection de produits frais et de qualité, soigneusement sélectionnés pour vous
            </p>
          </div>

          {/* Featured Product */}
          {featuredProduct && (
            <div className="mb-12">
              <Link href={`/produits/${featuredProduct.id}`} className="block">
                <div className="relative rounded-lg overflow-hidden group">
                  <Image
                    src={featuredProduct.image_url || "/images/product/little-star-1.jpeg"}
                    alt={featuredProduct.name}
                    width={1200}
                    height={400}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                    <div className="p-8 max-w-xl">
                      <Badge className="bg-primary hover:bg-primary/90 mb-4">Produit Vedette</Badge>
                      <h2 className="text-3xl font-bold text-white mb-4">{featuredProduct.name}</h2>
                      <p className="text-white/90 mb-6">
                        {featuredProduct.description || "Découvrez ce produit de qualité, soigneusement sélectionné pour vous."}
                      </p>
                      <Button className="bg-white text-primary hover:bg-white/90">Découvrir</Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>

              <div className="ml-4 flex items-center gap-4">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Nouveautés
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Promotions
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  Bio
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par:</span>
              <select className="border rounded-md p-2 text-sm">
                <option>Popularité</option>
                <option>Prix: croissant</option>
                <option>Prix: décroissant</option>
                <option>Nouveautés</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {formattedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="outline" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
