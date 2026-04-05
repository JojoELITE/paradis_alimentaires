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

const API_URL = "https://ecomerce-api-aotc.onrender.com//api"

interface Product {
  id: string
  name: string
  price: string | number
  imageUrl: string
  category: string | null
  categoryId: string
  description: string | null
  stock: number
  rating: number
  isNew: boolean
  isOnSale: boolean
  conservation: string | null
  origin: string | null
  packaging: string | null
  weight: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
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
            (p: Product) => p.id.toString() !== id
          )
          setRelatedProducts(filtered.slice(0, 4))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    fetchRelated()
  }, [id, token])

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)

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
        price: parseFloat(product.price as string),
        image: product.imageUrl || "/placeholder.png",
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
        toast({
          title: "Retiré des favoris",
          description: `${product.name} a été retiré de vos favoris`,
        })
      } else {
        addToFavorites({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price as string),
          image: product.imageUrl || "/placeholder.png",
          category: product.category || "Produits",
        })
        toast({
          title: "Ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris`,
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

  // Convertir le prix en nombre
  const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price

  // Images pour la galerie
  const images = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ]

  // ================= UI =================
  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* PRODUCT MAIN SECTION */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* LEFT - IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {images[activeImage] && (
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden border-2 transition-all",
                      activeImage === idx ? "border-primary" : "border-transparent"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - vue ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - PRODUCT INFO */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && (
                <Badge className="bg-green-500">Nouveau</Badge>
              )}
              {product.isOnSale && (
                <Badge className="bg-red-500">Promotion</Badge>
              )}
              {product.stock < 5 && product.stock > 0 && (
                <Badge variant="secondary">Plus que {product.stock} en stock</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Rupture de stock</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating || 0} / 5
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-primary">
              {productPrice.toLocaleString()} FCFA
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Product details */}
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-semibold mb-2">Détails du produit</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.origin && (
                  <>
                    <span className="text-gray-500">Origine:</span>
                    <span>{product.origin}</span>
                  </>
                )}
                {product.weight && (
                  <>
                    <span className="text-gray-500">Poids:</span>
                    <span>{product.weight}</span>
                  </>
                )}
                {product.packaging && (
                  <>
                    <span className="text-gray-500">Conditionnement:</span>
                    <span>{product.packaging}</span>
                  </>
                )}
                {product.conservation && (
                  <>
                    <span className="text-gray-500">Conservation:</span>
                    <span>{product.conservation}</span>
                  </>
                )}
                <span className="text-gray-500">Stock:</span>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} unités` : "Indisponible"}
                </span>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Quantité:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1"
                size="lg"
              >
                {isAddingToCart ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <ShoppingCart className="mr-2" />
                )}
                {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
              </Button>

              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                size="lg"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    isFavorite(product.id) && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
            </div>

            {/* Delivery Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center space-y-1">
                <Truck className="h-5 w-5 mx-auto text-gray-500" />
                <p className="text-xs text-gray-600">Livraison rapide</p>
              </div>
              <div className="text-center space-y-1">
                <ShieldCheck className="h-5 w-5 mx-auto text-gray-500" />
                <p className="text-xs text-gray-600">Paiement sécurisé</p>
              </div>
              <div className="text-center space-y-1">
                <RotateCcw className="h-5 w-5 mx-auto text-gray-500" />
                <p className="text-xs text-gray-600">Retour gratuit</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/produits/${p.id}`}>
                  <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={p.imageUrl || "/placeholder.png"}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2 min-h-[3rem]">
                        {p.name}
                      </h3>
                      <p className="text-primary font-bold mt-2">
                        {(typeof p.price === 'string' ? parseFloat(p.price) : p.price).toLocaleString()} FCFA
                      </p>
                      {p.isNew && (
                        <Badge className="mt-2 text-xs bg-green-500">Nouveau</Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
