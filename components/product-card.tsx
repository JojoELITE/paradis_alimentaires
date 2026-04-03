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
    id: string // ✅ FIX UUID
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

  const productPath = product.specialPath || `/produits/${product.id}`

  // ✅ format prix propre
  const displayPrice = product.price.toLocaleString()
  const displayOldPrice = product.oldPrice
    ? product.oldPrice.toLocaleString()
    : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || null,
          productId: product.id,
          quantity: 1,
        }),
      })

      toast({
        title: "Produit ajouté",
        description: product.name,
      })

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Ajout impossible",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    try {
      const isFav = isFavorite(product.id)

      if (isFav) {
        removeFromFavorites(product.id)
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
        })
      }

      toast({
        title: isFav ? "Retiré des favoris" : "Ajouté aux favoris",
        description: product.name,
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Action impossible",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden group shadow-md hover:shadow-lg transition">
      <CardContent className="p-0 relative">
        <Link href={productPath}>
          <div className="aspect-square relative overflow-hidden">

            {/* ✅ IMAGE SAFE */}
            <Image
              src={product.image || "/images/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.png"
              }}
            />

            {/* BADGES */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-green-500">Nouveau</Badge>}
              {product.isOnSale && <Badge>Promo</Badge>}
            </div>

            {/* FAVORI */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className="absolute top-2 right-2 bg-white/80 rounded-full"
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isFavorite(product.id) && "fill-primary text-primary"
                )}
              />
            </Button>

          </div>
        </Link>

        <div className="p-4">
          <p className="text-sm text-muted-foreground">{product.category}</p>

          <h3 className="font-semibold line-clamp-2">
            {product.name}
          </h3>

          <div className="flex gap-2 mt-2">
            <span className="font-bold">{displayPrice} FCFA</span>
            {displayOldPrice && (
              <span className="line-through text-sm text-gray-400">
                {displayOldPrice} FCFA
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  )
}
