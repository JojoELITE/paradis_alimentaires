"use client"

import { useState, useEffect } from "react"
import { useParams, notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Loader2,
  Check,
  Share2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const API_URL = "https://ecomerce-api-1-dp0w.onrender.com/api"

interface Product {
  id: number
  name: string
  description: string
  price: number
  old_price: number | null
  stock: number
  image_url: string
  category: string
  user_id: number
  is_new: boolean
  is_on_sale: boolean
  created_at: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()
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
        
        if (!res.ok || !data.success) {
          notFound()
          return
        }

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
          const allProducts = Array.isArray(data.data) ? data.data : data.data?.data || []
          const filtered = allProducts.filter((p: Product) => p.id.toString() !== id)
          setRelatedProducts(filtered.slice(0, 4))
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
      fetchRelated()
    }
  }, [id, token])

  // ================= QUANTITY HANDLERS =================
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    } else {
      toast({
        title: "Stock limité",
        description: `Stock disponible: ${product?.stock} unités`,
        variant: "destructive",
      })
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    if (!product) return
    if (product.stock === 0) {
      toast({
        title: "Produit indisponible",
        description: "Ce produit est actuellement en rupture de stock",
        variant: "destructive",
      })
      return
    }

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
        throw new Error(data.message || "Erreur lors de l'ajout au panier")
      }

      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || "/images/placeholder.png",
        quantity,
        category: product.category || "Produits",
      })

      toast({
        title: "✓ Ajouté au panier",
        description: `${quantity} × ${product.name}`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur serveur",
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
      const url = `${API_URL}/favorites/${isFav ? "remove" : "add"}`
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          userId: user?.id || null,
          productId: product.id,
        }),
      })

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
          price: product.price,
          image: product.image_url || "/images/placeholder.png",
          category: product.category || "Produits",
        })
        toast({
          title: "Ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive",
      })
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  // ================= SHARE PRODUCT =================
  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Lien copié !",
        description: "Le lien du produit a été copié dans votre presse-papier",
      })
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      })
    }
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-32">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Produit non trouvé</h2>
          <p className="text-muted-foreground mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push("/produits")}>
            Voir tous les produits
          </Button>
        </div>
      </div>
    )
  }

  const isLowStock = product.stock <= 5 && product.stock > 0
  const isOutOfStock = product.stock === 0
  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
    : 0

  return (
    <main className="pt-28 pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/produits" className="hover:text-primary transition-colors">Produits</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT - Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src={imageError || !product.image_url ? "/images/placeholder.png" : product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
              {product.is_new && (
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                  Nouveau
                </Badge>
              )}
              {product.is_on_sale && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  -{discount}%
                </Badge>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.image_url].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                    activeImage === idx ? "border-primary shadow-md" : "border-transparent opacity-70"
                  )}
                >
                  <Image
                    src={img || "/images/placeholder.png"}
                    alt={`${product.name} - vue ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <Link 
                href={`/categories/${product.category?.toLowerCase() || "produits"}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category || "Produits"}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                5.0 (128 avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                {product.price.toLocaleString()} FCFA
              </span>
              {product.old_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {product.old_price.toLocaleString()} FCFA
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <Badge variant="destructive" className="bg-red-500">
                  Rupture de stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="warning" className="bg-orange-500 text-white">
                  Plus que {product.stock} en stock
                </Badge>
              ) : (
                <Badge variant="default" className="bg-green-500 text-white">
                  En stock
                </Badge>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Quantité :</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none hover:bg-gray-100"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none hover:bg-gray-100"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOutOfStock}
              >
                {isAddingToCart ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                {isAddingToCart ? "Ajout en cours..." : "Ajouter au panier"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite(product.id) && "fill-red-500 text-red-500"
                  )}
                />
                {isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Livraison rapide</p>
                  <p className="text-xs text-muted-foreground">Sous 24-48h</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Paiement sécurisé</p>
                  <p className="text-xs text-muted-foreground">CB, Mobile Money</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Retour gratuit</p>
                  <p className="text-xs text-muted-foreground">Satisfait ou remboursé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Produits similaires</h2>
              <Link href="/produits" className="text-primary hover:underline text-sm">
                Voir tout
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/produits/${p.id}`}>
                  <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={p.image_url || "/images/placeholder.png"}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {p.name}
                      </h3>
                      <p className="text-primary font-bold text-sm">
                        {p.price.toLocaleString()} FCFA
                      </p>
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
