"use client"

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Check, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

// URL de ton API
const API_URL = "https://ecomerce-api-1-dp0w.onrender.com/api"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { id } = resolvedParams

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  
  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite, syncFavorites } = useFavorites()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`)
        const data = await res.json()
        if (!data.success) return notFound()
        setProduct(data.data)
      } catch (error) {
        console.error(error)
        notFound()
      }
    }

    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`)
        const data = await res.json()
        if (data.success) {
          const filtered = data.data.filter((p: any) => p.id.toString() !== id)
          setRelatedProducts(filtered)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    fetchRelatedProducts()
  }, [id])

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    const userId = user?.uuid || null

    try {
      // Appel API pour ajouter au panier
      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Impossible d'ajouter au panier")
      }

      // Ajouter au panier local
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity: quantity,
        category: product.category,
      })

      toast({
        title: "Produit ajouté au panier",
        description: `${quantity} × ${product.name} a été ajouté à votre panier.`,
      })
    } catch (error) {
      console.error("Erreur panier:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : `${product.name} n'a pas pu être ajouté au panier.`,
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true)

    // Si l'utilisateur n'est pas connecté, utiliser le localStorage
    if (!user?.uuid) {
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
          image: product.image_url,
          category: product.category,
        })
        toast({
          title: "Produit ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris.`,
        })
      }
      setIsTogglingFavorite(false)
      return
    }

    // Si l'utilisateur est connecté, utiliser l'API
    try {
      const isFav = isFavorite(product.id)
      const url = isFav 
        ? `${API_URL}/favorites/remove`
        : `${API_URL}/favorites/add`
      
      const requestBody = {
        userId: user.uuid,
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
          image: product.image_url,
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
      setIsTogglingFavorite(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Chargement du produit...</p>
    </div>
  )
  
  if (!product) return <p className="text-center py-16">Produit introuvable</p>

  // Simuler plusieurs images (tu peux ajuster selon ton modèle)
  const productImages = [product.image_url || "/placeholder.svg", "/images/fruits.png", "/images/vegetables.png"]

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-primary">Catégories</Link>
          <span className="mx-2">/</span>
          <Link
            href={`/categories/${product.category?.toLowerCase() ?? "inconnu"}`}
            className="hover:text-primary"
          >
            {product.category ?? "Inconnu"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image src={productImages[activeImage]} alt={product.name} fill className="object-cover" />
              {product.is_new && (
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">Nouveau</Badge>
              )}
              {product.is_on_sale && (
                <Badge className="absolute top-4 right-4 bg-primary hover:bg-primary/90">Promo</Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image src={image} alt={`${product.name} - Image ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                {product.rating || 0} ({product.reviews_count || 0} avis)
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-primary">{product.price.toLocaleString()} FCFA</span>
              {product.old_price && (
                <span className="ml-3 text-lg text-muted-foreground line-through">
                  {product.old_price.toLocaleString()} FCFA
                </span>
              )}
              {product.is_on_sale && product.old_price && (
                <Badge className="ml-3 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Quantity & Cart */}
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex items-center">
                <div className="mr-6">
                  <span className="block text-sm text-muted-foreground mb-1">Quantité</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none text-gray-500"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none text-gray-500"
                      onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                      disabled={quantity >= (product.stock || 999)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 flex gap-3">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90 h-12" 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    Ajouter au panier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12"
                    onClick={handleToggleFavorite}
                    disabled={isTogglingFavorite}
                  >
                    <Heart 
                      className={`h-5 w-5 transition-all ${isFavorite(product.id) ? "fill-primary text-primary" : ""}`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Livraison rapide</h4>
                  <p className="text-xs text-muted-foreground">En 24-48h</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Paiement sécurisé</h4>
                  <p className="text-xs text-muted-foreground">100% sécurisé</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Retour gratuit</h4>
                  <p className="text-xs text-muted-foreground">Sous 30 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <Link key={item.id} href={`/produits/${item.id}`} className="block border rounded-md p-3 hover:shadow-lg transition-all">
                  <div className="relative aspect-square mb-2">
                    <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-primary font-semibold mt-1">{item.price.toLocaleString()} FCFA</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}