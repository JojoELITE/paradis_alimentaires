"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Trash2, ShoppingBag } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"

export default function FavoritesPage() {
  const { items, removeItem } = useFavorites()
  const { addItem } = useCart()

  const handleAddToCart = (item: (typeof items)[0]) => {
    addItem({
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
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={(e) => {
                        e.preventDefault()
                        removeItem(item.id)
                        toast({
                          title: "Produit retiré des favoris",
                          description: `${item.name} a été retiré de vos favoris.`,
                        })
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
                    <span className="font-bold text-lg">{(item.price / 100).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="h-4 w-4" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
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
