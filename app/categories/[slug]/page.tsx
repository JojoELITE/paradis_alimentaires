"use client"

import { useEffect, useState } from "react"
import { usePathname, notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Filter, ArrowLeft } from "lucide-react"
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
  products?: Product[]
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

export default function CategoryPage() {
  const pathname = usePathname()
  const router = useRouter()
  
  // ✅ Extraction du slug avec REGEX
  // Pattern: /categories/ n'importe quel caractère (sauf /) jusqu'à la fin
  const regex = /\/categories\/([^\/?#]+)/
  const match = pathname?.match(regex)
  const slug = match ? match[1] : null

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null)
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<number | null>(null)

  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  // Charger toutes les catégories une fois
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const res = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/categories")
        if (res.ok) {
          const data = await res.json()
          let categoriesArray: Category[] = []
          
          if (Array.isArray(data)) {
            categoriesArray = data
          } else if (data.success && Array.isArray(data.data)) {
            categoriesArray = data.data
          } else if (data.categories && Array.isArray(data.categories)) {
            categoriesArray = data.categories
          }
          
          setAllCategories(categoriesArray)
        }
      } catch (err) {
        console.error("Erreur chargement catégories:", err)
      }
    }
    
    fetchAllCategories()
  }, [])

  useEffect(() => {
    if (!slug) {
      router.push("/categories")
      return
    }

    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Décoder le slug (pour gérer les espaces, accents, etc.)
        const decodedSlug = decodeURIComponent(slug)
        
        // 1. Essayer de trouver la catégorie par son slug ou son nom dans la liste déjà chargée
        let foundCategory = allCategories.find(
          cat => cat.slug?.toLowerCase() === decodedSlug.toLowerCase() ||
                 cat.name?.toLowerCase() === decodedSlug.toLowerCase()
        )
        
        let res
        
        if (foundCategory) {
          // Si trouvée, récupérer par ID
          res = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/categories/${foundCategory.id}`)
        } else {
          // Sinon, essayer directement par slug
          res = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/categories/${decodedSlug}`)
          
          // Si toujours pas trouvé, essayer avec une regex sur le nom
          if (!res.ok && res.status === 404 && allCategories.length > 0) {
            // Nettoyer le slug pour la recherche (enlever accents, mettre en minuscule)
            const cleanSlug = decodedSlug
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]/g, '')
            
            foundCategory = allCategories.find(cat => {
              const cleanName = cat.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]/g, '')
              return cleanName === cleanSlug
            })
            
            if (foundCategory) {
              res = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/categories/${foundCategory.id}`)
            }
          }
        }

        if (!res || !res.ok) {
          if (res?.status === 404) {
            notFound()
          }
          throw new Error(`HTTP error ${res?.status}`)
        }

        const data = await res.json()

        if (data.success) {
          setCategory(data.data)
          setProducts(data.data.products || [])
        } else {
          throw new Error(data.message || "Impossible de récupérer la catégorie")
        }
      } catch (err) {
        console.error("Erreur:", err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    if (allCategories.length > 0 || slug) {
      fetchCategoryAndProducts()
    }
  }, [slug, router, allCategories])

  const handleAddToCart = async (product: Product) => {
    setLoadingProductId(product.id)
    const userId = user?.id || null

    try {
      const response = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product.id, quantity: 1 }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Impossible d'ajouter au panier")

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || "/images/placeholder.png",
        quantity: 1,
        category: product.category?.name || "Produits",
      })

      toast({ title: "Produit ajouté au panier", description: `${product.name} a été ajouté à votre panier.` })
    } catch (error) {
      console.error("Erreur panier:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur ajout panier",
        variant: "destructive",
      })
    } finally {
      setLoadingProductId(null)
    }
  }

  const handleToggleFavorite = async (product: Product) => {
    setLoadingFavoriteId(product.id)
    const userId = user?.id || null
    const isFav = isFavorite(product.id)

    if (!userId) {
      if (isFav) removeFromFavorites(product.id)
      else
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || "/images/placeholder.png",
          category: product.category?.name || "Produits",
        })
      setLoadingFavoriteId(null)
      return
    }

    try {
      const url = isFav
        ? "https://ecomerce-api-1-dp0w.onrender.com/api/favorites/remove"
        : "https://ecomerce-api-1-dp0w.onrender.com/api/favorites/add"

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product.id }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Erreur favoris")

      if (isFav) removeFromFavorites(product.id)
      else
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || "/images/placeholder.png",
          category: product.category?.name || "Produits",
        })
    } catch (error) {
      console.error("Erreur favoris:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur favoris",
        variant: "destructive",
      })
    } finally {
      setLoadingFavoriteId(null)
    }
  }

  const formatPrice = (price: number) => price.toLocaleString()

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !category) {
    return (
      <main className="flex min-h-screen flex-col pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Catégorie introuvable</h1>
          <p className="text-muted-foreground mb-6">
            {error || `La catégorie "${slug}" que vous recherchez n'existe pas.`}
          </p>
          <Button onClick={() => router.push("/categories")}>
            Voir toutes les catégories
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Bouton retour */}
        <Button 
          variant="ghost" 
          className="mb-4 gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Hero */}
        <div className="relative h-[300px] rounded-lg overflow-hidden mb-12">
          <Image
            src={category.image_url || "/images/placeholder-category.jpg"}
            alt={category.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/images/placeholder-category.jpg"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8 max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
              <p className="text-white/90">
                {category.description || `Découvrez notre sélection de ${category.name.toLowerCase()}`}
              </p>
              {category.product_count > 0 && (
                <p className="text-white/80 mt-2">{category.product_count} produits disponibles</p>
              )}
            </div>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0 relative">
                  <Link href={`/produits/${product.id}`}>
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.image_url || "/images/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/images/placeholder.png"
                        }}
                      />
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2">
                        {product.is_new && <Badge className="bg-green-500 hover:bg-green-600">Nouveau</Badge>}
                        {product.is_on_sale && <Badge className="bg-primary hover:bg-primary/90">Promo</Badge>}
                      </div>
                      {/* Favorite */}
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
                    <div className="text-sm text-muted-foreground mb-1">{product.category?.name || "Produits"}</div>
                    <Link href={`/produits/${product.id}`} className="hover:underline">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{formatPrice(product.price)} FCFA</span>
                      {product.old_price && (
                        <span className="text-muted-foreground line-through text-sm">{formatPrice(product.old_price)} FCFA</span>
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
            <Button className="mt-4" onClick={() => router.push("/")}>
              Continuer vos achats
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
