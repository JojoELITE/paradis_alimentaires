"use client"

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const API_URL = "https://ecomerce-api-1-dp0w.onrender.com/api"

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)

  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } =
    useFavorites()
  const { user } = useAuth()

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        })

        const data = await res.json()
        if (!data.success) return notFound()

        setProduct(data.data)
      } catch (error) {
        console.error(error)
        notFound()
      }
    }

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_URL}/products`)
        const data = await res.json()

        if (data.success) {
          const filtered = data.data.data.filter(
            (p: any) => p.id.toString() !== id
          )
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    fetchRelated()
  }, [id])

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)

    const userId = user?.id || user?.id || null

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
          quantity,
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
        image: product.image_url || "/placeholder.png",
        quantity,
        category: product.category || "Produits",
      })

      toast({
        title: "Produit ajouté",
        description: `${quantity} × ${product.name}`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  // ================= FAVORITES =================
  const handleToggleFavorite = async () => {
    if (!product) return

    setIsTogglingFavorite(true)

    try {
      const isFav = isFavorite(product.id)

      const res = await fetch(
        `${API_URL}/favorites/${isFav ? "remove" : "add"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            userId: user?.id,
            productId: product.id,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      if (isFav) {
        removeFromFavorites(product.id)
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || "/placeholder.png",
          category: product.category || "Produits",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur favoris",
        description:
          error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive",
      })
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  // ================= LOADING =================
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )

  if (!product) return <p>Produit introuvable</p>

  const images = [
    product.image_url,
    product.image_url,
    product.image_url,
  ]

  // ================= UI =================
  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">

        {/* TITLE */}
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* PRICE */}
        <p className="text-primary text-2xl mt-2">
          {product.price.toLocaleString()} FCFA
        </p>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-6">
          <Button onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ShoppingCart />
            )}
            Ajouter
          </Button>

          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            <Heart
              className={cn(
                isFavorite(product.id) && "fill-red-500 text-red-500"
              )}
            />
          </Button>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          <div>
            <Truck /> Livraison rapide
          </div>
          <div>
            <ShieldCheck /> Paiement sécurisé
          </div>
          <div>
            <RotateCcw /> Retour gratuit
          </div>
        </div>

        {/* RELATED */}
        <h2 className="text-xl font-bold mt-10">Produits similaires</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {relatedProducts.slice(0, 4).map((p) => (
            <Link key={p.id} href={`/produits/${p.id}`}>
              <div className="border p-2 rounded">
                <Image
                  src={p.image_url || "/placeholder.png"}
                  alt={p.name}
                  width={200}
                  height={200}
                />
                <p>{p.name}</p>
                <p className="text-primary">
                  {p.price.toLocaleString()} FCFA
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
