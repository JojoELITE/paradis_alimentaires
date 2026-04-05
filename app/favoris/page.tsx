"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Trash2, ShoppingBag } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  imageUrl?: string  // Ajout pour la compatibilité
  category: string
}

export default function FavoritesPage() {
  const { items, removeItem, addItem: addToFavoritesLocal, setItems } = useFavorites()
  const { addItem: addToCart } = useCart()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  // Charger les favoris depuis l'API si l'utilisateur est connecté
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.id) {
        setIsLoading(true)
        try {
          const response = await fetch(`https://ecomerce-api-aotc.onrender.com//api/favorites?userId=${user.id}`)
          const data = await response.json()

          console.log("🔵 Favoris depuis API:", data)

          if (data.success && data.data) {
            // Convertir les données API au format local
            const favoriteItems = data.data.map((product: any) => ({
              id: product.id,
              name: product.name,
              price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
              // Important: Utiliser imageUrl car c'est ce que votre API renvoie
              image: product.imageUrl || product.image || "/placeholder.png",
              category: product.category || "Produits"
            }))
            setItems(favoriteItems)
          }
        } catch (error) {
          console.error("❌ Erreur lors du chargement des favoris:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [user, setItems])

  const handleAddToCart = (item: FavoriteItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      category: item.category,
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${item.name} a été ajouté à votre panier.`,
    })
  }

  const handleRemoveFavorite = async (item: FavoriteItem) => {
    // Supprimer localement d'abord pour l'UI réactive
    removeItem(item.id)

    toast({
      title: "Produit retiré des favoris",
      description: `${item.name} a été retiré de vos favoris.`,
    })

    // Si l'utilisateur est connecté, supprimer aussi via l'API
    if (user?.id) {
      try {
        const response = await fetch("https://ecomerce-api-aotc.onrender.com//api/favorites/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            productId: item.id,
          }),
        })

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression")
        }

        console.log("✅ Favori supprimé de l'API")
      } catch (error) {
        console.error("❌ Erreur lors de la suppression API:", error)
        // Si l'API échoue, remettre l'item
        addToFavoritesLocal(item)
        toast({
          title: "Erreur",
          description: "Impossible de supprimer des favoris. Veuillez réessayer.",
          variant: "destructive",
        })
      }
    }
  }

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (item: FavoriteItem) => {
    // Si l'image est une URL complète, l'utiliser directement
    if (item.image?.startsWith('http')) {
      return item.image
    }
    // Sinon, utiliser le placeholder
    return "/placeholder.png"
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de vos favoris...</p>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-32 w-32">
              <Heart className="h-full w-full text-gray-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Votre liste de favoris est vide</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Vous n'avez pas encore ajouté de produits à vos favoris. Parcourez notre catalogue et ajoutez les produits
            que vous aimez à votre liste de favoris.
          </p>
          <Link href="/produits">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mes Favoris</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0 relative">
                <Link href={`/produits/${item.id}`}>
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <Image
                      src={getImageUrl(item)}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Si l'image ne charge pas, utiliser le placeholder
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.png";
                      }}
                    />

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveFavorite(item)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{item.category}</div>
                  <Link href={`/produits/${item.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">
                      {item.price.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full gap-2 bg-primary hover:bg-primary/90"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/produits">
            <Button variant="outline" className="w-full sm:w-auto">
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/panier">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Voir mon panier
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
