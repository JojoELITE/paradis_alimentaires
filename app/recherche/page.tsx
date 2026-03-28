"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Search } from "lucide-react"
import SearchBar from "@/components/search-bar"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { toast } from "@/components/ui/use-toast"

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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()

  // Récupérer tous les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://ecomerce-api-1-dp0w.onrender.com/api/products')
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        
        if (data.success === true) {
          setAllProducts(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filtrer les produits en fonction de la recherche
  useEffect(() => {
    if (!query || allProducts.length === 0) {
      setSearchResults([])
      return
    }

    const lowerCaseQuery = query.toLowerCase()
    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        (product.category && product.category.toLowerCase().includes(lowerCaseQuery))
    )

    setSearchResults(results)
  }, [query, allProducts])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/images/placeholder.png",
      quantity: 1,
      category: product.category || "Produits",
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
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
        category: product.category || "Produits",
      })
      toast({
        title: "Produit ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris.`,
      })
    }
  }

  // Formater le prix
  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">Recherche</h1>
            <SearchBar initialQuery={query} />
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Recherche</h1>
          <SearchBar initialQuery={query} />
        </div>

        <>
          {query && (
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                {searchResults.length > 0
                  ? `${searchResults.length} résultat${searchResults.length > 1 ? "s" : ""} pour "${query}"`
                  : `Aucun résultat pour "${query}"`}
              </h2>
            </div>
          )}

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
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
                        >
                          <Heart className={`h-5 w-5 ${isFavorite(product.id) ? "fill-primary text-primary" : ""}`} />
                        </Button>
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="text-sm text-muted-foreground mb-1">{product.category || "Produits"}</div>
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
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Ajouter au panier
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Nous n'avons pas trouvé de produits correspondant à votre recherche. Essayez avec d'autres mots-clés
                ou parcourez nos catégories.
              </p>
              <Link href="/produits">
                <Button className="bg-primary hover:bg-primary/90">Voir tous les produits</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Que recherchez-vous ?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Utilisez la barre de recherche ci-dessus pour trouver des produits par nom ou catégorie.
              </p>
            </div>
          )}
        </>
      </div>
    </main>
  )
}