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

// Produits disponibles (normalement, cela viendrait d'une API)
const allProducts = [
  {
    id: 1,
    name: "Panier de fruits frais",
    price: 24990,
    oldPrice: 29990,
    image: "/images/fruits.png",
    category: "Fruits",
    isNew: true,
    isOnSale: true,
  },
  {
    id: 2,
    name: "Légumes bio assortis",
    price: 19990,
    oldPrice: null,
    image: "/images/vegetables.png",
    category: "Légumes",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 3,
    name: "Filet de saumon premium",
    price: 15990,
    oldPrice: 18990,
    image: "/images/fish.png",
    category: "Poissons",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 4,
    name: "Fromage artisanal",
    price: 8990,
    oldPrice: null,
    image: "/images/dairy.png",
    category: "Produits laitiers",
    isNew: false,
    isOnSale: false,
  },
  {
    id: 5,
    name: "Viande de bœuf premium",
    price: 22990,
    oldPrice: 25990,
    image: "/images/meat.png",
    category: "Viandes",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 6,
    name: "Huile d'olive extra vierge",
    price: 12990,
    oldPrice: null,
    image: "/images/grocery.png",
    category: "Épicerie",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 7,
    name: "Jus de fruits frais",
    price: 9990,
    oldPrice: 11990,
    image: "/images/juice.png",
    category: "Boissons",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 8,
    name: "Biscuits artisanaux",
    price: 14990,
    oldPrice: null,
    image: "/images/biscuit.png",
    category: "Épicerie",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 9,
    name: "Chips Crunch",
    price: 2990,
    oldPrice: 3990,
    image: "/images/hero3.jpeg",
    category: "Snacks",
    isNew: true,
    isOnSale: true,
  },
  {
    id: 10,
    name: "Chocolat Eni",
    price: 3990,
    oldPrice: 4990,
    image: "/images/hero1.jpeg",
    category: "Snacks",
    isNew: true,
    isOnSale: true,
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<typeof allProducts>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()

  useEffect(() => {
    setIsLoading(true)

    // Simuler un délai de chargement
    const timer = setTimeout(() => {
      if (!query) {
        setSearchResults([])
        setIsLoading(false)
        return
      }

      const lowerCaseQuery = query.toLowerCase()
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery),
      )

      setSearchResults(results)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const handleAddToCart = (product: (typeof allProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    })
  }

  const handleToggleFavorite = (product: (typeof allProducts)[0]) => {
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
        image: product.image,
        category: product.category,
      })
      toast({
        title: "Produit ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris.`,
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Recherche</h1>
          <SearchBar initialQuery={query} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
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
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-2">
                            {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">Nouveau</Badge>}
                            {product.isOnSale && <Badge className="bg-primary hover:bg-primary/90">Promo</Badge>}
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
                        <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                        <Link href={`/produits/${product.id}`} className="hover:underline">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{(product.price / 100).toLocaleString()} FCFA</span>
                          {product.oldPrice && (
                            <span className="text-muted-foreground line-through text-sm">
                              {(product.oldPrice / 100).toLocaleString()} FCFA
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
        )}
      </div>
    </main>
  )
}
