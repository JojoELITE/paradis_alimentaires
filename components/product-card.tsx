"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    oldPrice?: number | null
    image: string
    category: string
    isNew?: boolean
    isOnSale?: boolean
    specialPath?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const userId = user?.id || null

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
    }

    // Ajouter au panier local pour réactivité UI
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
    })
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)

    // Si l'utilisateur n'est pas connecté, utiliser le localStorage
    if (!user?.id) {
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
      setIsLoading(false)
      return
    }

    // Si l'utilisateur est connecté, utiliser l'API
    try {
      const isFav = isFavorite(product.id)
      const url = isFav 
        ? "http://127.0.0.1:3333/api/favorites/remove"
        : "http://127.0.0.1:3333/api/favorites/add"
      
      const requestBody = {
        userId: user.id,
        productId: product.id,
      }
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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
          image: product.image,
          category: product.category,
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
      setIsLoading(false)
    }
  }

  const productPath = product.specialPath || `/produits/${product.id}`
  const displayPrice = product.id < 100 ? (product.price / 100).toLocaleString() : product.price
  const displayOldPrice = product.oldPrice
    ? product.id < 100
      ? (product.oldPrice / 100).toLocaleString()
      : product.oldPrice
    : null

  return (
    <Card className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0 relative">
        <Link href={productPath}>
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
              onClick={handleToggleFavorite}
              disabled={isLoading}
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-all",
                  isFavorite(product.id) ? "fill-primary text-primary" : "",
                  isLoading && "animate-pulse"
                )} 
              />
            </Button>
          </div>
        </Link>

        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
          <Link href={productPath} className="hover:underline">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{displayPrice} FCFA</span>
            {displayOldPrice && (
              <span className="text-muted-foreground line-through text-sm">{displayOldPrice} FCFA</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  )
}