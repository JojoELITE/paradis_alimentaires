"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  icon_name: string | null
  product_count: number
}

interface Product {
  id: number
  name: string
  price: number
  old_price: number | null
  image_url: string | null
  category_id: string | null
  category?: {
    id: string
    name: string
    slug: string
  }
  is_new: boolean
  is_on_sale: boolean
  stock: number
  description?: string
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null)
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<number | null>(null)
  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true)
        
        const categoryRes = await fetch(`http://127.0.0.1:3333/api/categories/${slug}`)
        
        if (!categoryRes.ok) {
          if (categoryRes.status === 404) {
            notFound()
          }
          throw new Error(`HTTP error! status: ${categoryRes.status}`)
        }
        
        const categoryData = await categoryRes.json()
        
        if (categoryData.success === true) {
          setCategory(categoryData.data)
          setProducts(categoryData.data.products || [])
        } else {
          throw new Error(categoryData.message || 'Failed to fetch category')
        }
      } catch (err) {
        console.error('Error fetching category:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [slug])

  const handleAddToCart = async (product: Product) => {
    setLoadingProductId(product.id)
    
    const userId = user?.uuid || null

    try {
      const response = await fetch("http://127.0.0.1:3333/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: 1,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'ajouter au panier")
      }

      // Ajouter au panier local
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || "/images/placeholder.png",
        quantity: 1,
        category: product.category?.name || "Produits",
      })

      toast({
        title: "Produit ajouté au panier",
        description: `${product.name} a été ajouté à votre panier.`,
      })
    } catch (error) {
      console.error("Erreur panier:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : `${product.name} n'a pas pu être ajouté au panier.`,
        variant: "destructive",
      })
    } finally {
      setLoadingProductId(null)
    }
  }

  const handleToggleFavorite = async (product: Product) => {
    setLoadingFavoriteId(product.id)
    
    const userId = user?.uuid || null
    const isFav = isFavorite(product.id)

    // Si l'utilisateur n'est pas connecté, utiliser le localStorage
    if (!userId) {
      if (isFav) {
        removeFromFavorites(product.id)
        toast({
          title: "Produit retiré des favoris",
          description: `${product.name} a été retiré de vos favoris.`,
        })
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || "/images/placeholder.png",
          category: product.category?.name || "Produits",
        })
        toast({
          title: "Produit ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris.`,
        })
      }
      setLoadingFavoriteId(null)
      return
    }

    // Si l'utilisateur est connecté, utiliser l'API
    try {
      const url = isFav 
        ? "http://127.0.0.1:3333/api/favorites/remove"
        : "http://127.0.0.1:3333/api/favorites/add"
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`)
      }

      if (isFav) {
        removeFromFavorites(product.id)
        toast({
          title: "Produit retiré des favoris",
          description: `${product.name} a été retiré de vos favoris.`,
        })
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || "/images/placeholder.png",
          category: product.category?.name || "Produits",
        })
        toast({
          title: "Produit ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris.`,
        })
      }
    } catch (error) {
      console.error("Erreur favoris:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setLoadingFavoriteId(null)
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-[300px] bg-gray-200 rounded-lg mb-12"></div>
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !category) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[300px] rounded-lg overflow-hidden mb-12">
          <Image 
            src={category.image_url || "/images/placeholder.png"} 
            alt={category.name} 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8 max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
              <p className="text-white/90">
                {category.description || `Découvrez notre sélection de ${category.name.toLowerCase()} de qualité.`}
              </p>
              {category.product_count > 0 && (
                <p className="text-white/80 mt-2">{category.product_count} produits disponibles</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
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

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0 relative">
                  <Link href={`/produits/${product.id}`}>
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.image_url || "/images/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {product.is_new && <Badge className="bg-green-500 hover:bg-green-600">Nouveau</Badge>}
                        {product.is_on_sale && <Badge className="bg-primary hover:bg-primary/90">Promo</Badge>}
                      </div>

                      {/* Favorite Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-muted-foreground hover:text-primary rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleFavorite(product)
                        }}
                        disabled={loadingFavoriteId === product.id}
                      >
                        <Heart 
                          className={cn(
                            "h-5 w-5",
                            isFavorite(product.id) ? "fill-primary text-primary" : "",
                            loadingFavoriteId === product.id && "animate-pulse"
                          )} 
                        />
                      </Button>
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {product.category?.name || "Produits"}
                    </div>
                    <Link href={`/produits/${product.id}`} className="hover:underline">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{formatPrice(product.price)} FCFA</span>
                      {product.old_price && (
                        <span className="text-muted-foreground line-through text-sm">
                          {formatPrice(product.old_price)} FCFA
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full gap-2 bg-primary hover:bg-primary/90"
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingProductId === product.id}
                  >
                    <ShoppingCart className={cn("h-4 w-4", loadingProductId === product.id && "animate-pulse")} />
                    {loadingProductId === product.id ? "Ajout en cours..." : "Ajouter au panier"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center">
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
        )}
      </div>
    </main>
  )
}