"use client"

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const API_URL = "https://ecomerce-api-1-dp0w.onrender.com/api"

interface Product {
  id: string
  name: string
  description: string | null
  price: number | string
  stock: number
  image_url?: string
  imageUrl?: string
  category: string | null
  categoryId: string
  isNew: boolean
  isOnSale: boolean
  rating: number
  origin: string | null
  weight: string | null
  packaging: string | null
  conservation: string | null
  createdAt: string
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

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (item: any) => {
    const url = item?.imageUrl || item?.image_url || item?.image
    if (url && url.startsWith('http')) {
      return url
    }
    return "/placeholder.png"
  }

  // Générer une galerie d'images (simulée pour l'exemple)
  const getProductImages = (product: Product) => {
    const mainImage = getImageUrl(product)
    // Si vous avez plusieurs images dans votre API, vous pouvez les ajouter ici
    // Pour l'instant, on utilise la même image avec différentes variantes
    return [
      mainImage,
      mainImage,
      mainImage,
    ]
  }

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

        // Convertir le prix en nombre si nécessaire
        const productData = data.data
        if (productData && typeof productData.price === 'string') {
          productData.price = parseFloat(productData.price)
        }
        
        setProduct(productData)
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
          const filtered = data.data.data
            .filter((p: Product) => p.id.toString() !== id)
            .map((p: Product) => {
              if (typeof p.price === 'string') {
                p.price = parseFloat(p.price)
              }
              return p
            })
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
    const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price

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
        price: productPrice,
        image: getImageUrl(product),
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

      const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price

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
          price: productPrice,
          image: getImageUrl(product),
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

  // Navigation des images
  const nextImage = () => {
    if (product) {
      const images = getProductImages(product)
      setActiveImage((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (product) {
      const images = getProductImages(product)
      setActiveImage((prev) => (prev - 1 + images.length) % images.length)
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

  const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price
  const images = getProductImages(product)

  // ================= UI =================
  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* PRODUCT MAIN SECTION - Layout amélioré */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* LEFT COLUMN - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.png";
                }}
              />
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden border-2 transition-all",
                      activeImage === idx ? "border-primary" : "border-transparent hover:border-gray-300"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - vue ${idx + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
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
            {(product.origin || product.weight || product.packaging || product.conservation) && (
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
                </div>
              </div>
            )}

            {/* Stock info */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Stock:</span>
              <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                {product.stock > 0 ? `${product.stock} unités disponibles` : "Indisponible"}
              </span>
            </div>

            {/* Quantity selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Quantité:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-r-lg"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {product.stock}
                </span>
              </div>
            )}

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => {
                const relatedPrice = typeof p.price === 'string' ? parseFloat(p.price) : p.price
                const relatedImage = getImageUrl(p)
                
                return (
                  <Link key={p.id} href={`/produits/${p.id}`}>
                    <div className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                      <div className="relative aspect-square bg-gray-100">
                        <Image
                          src={relatedImage}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.png";
                          }}
                        />
                        {p.isNew && (
                          <Badge className="absolute top-2 left-2 text-xs bg-green-500">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <div className="p-3 md:p-4">
                        <h3 className="font-medium text-sm md:text-base line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                          {p.name}
                        </h3>
                        <p className="text-primary font-bold text-sm md:text-base mt-2">
                          {relatedPrice.toLocaleString()} FCFA
                        </p>
                        {p.category && (
                          <p className="text-xs text-gray-500 mt-1">{p.category}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Si pas de produits similaires */}
        {relatedProducts.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-gray-500">Aucun produit similaire pour le moment</p>
            <Link href="/produits">
              <Button variant="outline" className="mt-4">
                Voir tous les produits
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
