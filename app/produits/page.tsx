"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Loader2, Search } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_URL = "https://ecomerce-api-1-dp0w.onrender.com/api"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  imageUrl: string | null
  category: string | null
  categoryId: string | null
  isNew: boolean | null
  isOnSale: boolean | null
  rating: number
  origin: string | null
  weight: string | null
  packaging: string | null
  conservation: string | null
  createdAt: string
  userId: string
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [categories, setCategories] = useState<string[]>([])
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (product: Product) => {
    if (product.imageUrl && product.imageUrl.startsWith('http')) {
      return product.imageUrl
    }
    return "/placeholder.png"
  }

  // Récupérer tous les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/products`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })

        const data = await res.json()
        console.log("📦 Tous les produits:", data)

        // ✅ CORRECTION IMPORTANTE: la liste est dans data.data directement
        if (data.success && data.data) {
          // Convertir les prix en nombres
          const productsData = data.data.map((product: any) => ({
            ...product,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            imageUrl: product.imageUrl || null,
            isNew: product.isNew === true,
            isOnSale: product.isOnSale === true,
            rating: product.rating || 0
          }))
          
          setProducts(productsData)
          
          // Extraire les catégories uniques (filtrer les null)
          const uniqueCategories = [...new Set(productsData.map((p: Product) => p.category).filter(Boolean))]
          setCategories(uniqueCategories as string[])
        } else {
          console.error("Structure API inattendue:", data)
          setProducts([])
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des produits:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [token])

  // Ajouter au panier
  const handleAddToCart = async (product: Product) => {
    setAddingToCart(product.id)
    
    const userId = user?.id || null

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          userId,
          productId: product.id,
          quantity: 1,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erreur panier")
      }

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product),
        quantity: 1,
        category: product.category || "Produits",
      })

      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté au panier`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(null)
    }
  }

  // Ajouter/retirer des favoris
  const handleToggleFavorite = async (product: Product) => {
    const isFav = isFavorite(product.id)

    try {
      const res = await fetch(`${API_URL}/favorites/${isFav ? "remove" : "add"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId: product.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      if (isFav) {
        removeFromFavorites(product.id)
        toast({
          title: "Retiré des favoris",
          description: `${product.name} a été retiré`,
        })
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: getImageUrl(product),
          category: product.category || "Produits",
        })
        toast({
          title: "Ajouté aux favoris",
          description: `${product.name} a été ajouté`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      })
    }
  }

  // Filtrer et trier les produits
  const filteredProducts = products.filter(product => {
    // Filtre par recherche
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    // Filtre par catégorie
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "name-asc":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement des produits...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Produits</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre collection de produits de qualité
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="name-asc">Nom A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {sortedProducts.length} produit{sortedProducts.length !== 1 ? 's' : ''} trouvé{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille des produits */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const imageUrl = getImageUrl(product)
              const isFav = isFavorite(product.id)
              
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <Link href={`/produits/${product.id}`}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.png";
                        }}
                      />
                      {product.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-500">
                          Nouveau
                        </Badge>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">
                            Rupture de stock
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Infos produit */}
                  <div className="p-4">
                    {product.category && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {product.category}
                      </p>
                    )}
                    
                    <Link href={`/produits/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < Math.floor(product.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.rating || 0})
                      </span>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} FCFA
                      </span>
                      {product.stock > 0 && product.stock < 5 && (
                        <span className="text-xs text-orange-500">
                          Plus que {product.stock}
                        </span>
                      )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-2"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0 || addingToCart === product.id}
                      >
                        {addingToCart === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                        Ajouter
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFavorite(product)}
                        className="px-3"
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isFav && "fill-red-500 text-red-500"
                          )}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Statistiques */}
        {products.length > 0 && (
          <div className="mt-12 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{products.length}</p>
                <p className="text-sm text-muted-foreground">Produits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Catégories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {products.filter(p => p.stock > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">En stock</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {products.filter(p => p.isNew).length}
                </p>
                <p className="text-sm text-muted-foreground">Nouveautés</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
