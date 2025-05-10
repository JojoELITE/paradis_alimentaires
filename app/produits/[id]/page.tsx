"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"

// Produits disponibles
const products = [
  {
    id: "1",
    name: "Panier de fruits frais",
    price: 24990,
    oldPrice: 29990,
    image: "/images/fruits.png",
    category: "Fruits",
    isNew: true,
    isOnSale: true,
    description:
      "Un assortiment de fruits frais et savoureux, soigneusement sélectionnés pour leur qualité et leur goût exceptionnel. Ce panier contient une variété de fruits de saison, parfaits pour une alimentation saine et équilibrée.",
    details: {
      origin: "Local",
      weight: "Environ 3 kg",
      packaging: "Panier en osier",
      conservation: "À conserver dans un endroit frais et sec",
    },
    stock: 15,
    rating: 4.8,
    reviews: 24,
    relatedProducts: [2, 7, 8],
  },
  {
    id: "2",
    name: "Légumes bio assortis",
    price: 19990,
    oldPrice: null,
    image: "/images/vegetables.png",
    category: "Légumes",
    isNew: true,
    isOnSale: false,
    description:
      "Une sélection de légumes biologiques frais, cultivés sans pesticides ni produits chimiques. Idéal pour préparer des repas sains et savoureux pour toute la famille.",
    details: {
      origin: "Agriculture biologique locale",
      weight: "Environ 2.5 kg",
      packaging: "Caisse en bois recyclé",
      conservation: "À conserver au réfrigérateur",
    },
    stock: 8,
    rating: 4.6,
    reviews: 18,
    relatedProducts: [1, 9, 3],
  },
  {
    id: "3",
    name: "Filet de saumon premium",
    price: 15990,
    oldPrice: 18990,
    image: "/images/fish.png",
    category: "Poissons",
    isNew: false,
    isOnSale: true,
    description:
      "Filet de saumon de qualité supérieure, riche en oméga-3 et en protéines. Parfait pour un repas sain et délicieux, ce saumon peut être préparé de nombreuses façons : grillé, poché, en papillote...",
    details: {
      origin: "Norvège",
      weight: "Environ 250g par filet",
      packaging: "Sous vide",
      conservation: "À conserver au réfrigérateur et à consommer dans les 3 jours après ouverture",
    },
    stock: 12,
    rating: 4.9,
    reviews: 32,
    relatedProducts: [4, 5, 6],
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()

  // Trouver le produit correspondant
  const product = products.find((p) => p.id === id)

  // Si le produit n'existe pas, retourner une page 404
  if (!product) {
    notFound()
  }

  // Images du produit (simulées)
  const productImages = [product.image, "/images/fruits.png", "/images/vegetables.png"]

  const handleAddToCart = () => {
    addItem({
      id: Number.parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      category: product.category,
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} × ${product.name} a été ajouté à votre panier.`,
    })
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-primary">
            Catégories
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={productImages[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">Nouveau</Badge>
              )}
              {product.isOnSale && (
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
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
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
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-primary">{product.price.toLocaleString()} FCFA</span>
              {product.oldPrice && (
                <span className="ml-3 text-lg text-muted-foreground line-through">
                  {product.oldPrice.toLocaleString()} FCFA
                </span>
              )}
              {product.isOnSale && (
                <Badge className="ml-3 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  -{Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)}%
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Disponibilité:</span>
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  En stock ({product.stock} disponibles)
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Catégorie:</span>
                <Link href={`/categories/${product.category.toLowerCase()}`} className="text-primary hover:underline">
                  {product.category}
                </Link>
              </div>
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between mb-2">
                  <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

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
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 flex gap-3">
                  <Button className="flex-1 bg-primary hover:bg-primary/90 h-12" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ajouter au panier
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

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
                  <h4 className="text-sm font-medium">Qualité garantie</h4>
                  <p className="text-xs text-muted-foreground">Produits sélectionnés</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Retours faciles</h4>
                  <p className="text-xs text-muted-foreground">Sous 14 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6"
              >
                Détails
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6"
              >
                Avis ({product.reviews})
              </TabsTrigger>
            </TabsList>
            <div className="bg-white rounded-lg shadow-md mt-4 p-6">
              <TabsContent value="description" className="mt-0">
                <h3 className="text-xl font-semibold mb-4">Description du produit</h3>
                <p className="text-muted-foreground">{product.description}</p>
                <p className="text-muted-foreground mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl eget
                  ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.
                </p>
                <p className="text-muted-foreground mt-4">
                  Nulla facilisi. Sed euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies
                  nisl nisl eget ultricies ultricies. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </TabsContent>
              <TabsContent value="details" className="mt-0">
                <h3 className="text-xl font-semibold mb-4">Détails du produit</h3>
                <div className="space-y-4">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-100">
                      <div className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="md:col-span-2 text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-0">
                <h3 className="text-xl font-semibold mb-4">Avis clients</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{product.rating}</div>
                    <div className="flex justify-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Basé sur {product.reviews} avis</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      {/* Sample reviews */}
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b border-gray-100 pb-6">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Client {review}</h4>
                            <span className="text-sm text-muted-foreground">
                              Il y a {review} jour{review > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < 5 - (review % 2) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod, nisl
                            eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies
                            ultricies.
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-6 bg-primary hover:bg-primary/90">Voir tous les avis</Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => p.id !== id)
              .map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  <Link href={`/produits/${relatedProduct.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {relatedProduct.isNew && (
                        <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Nouveau</Badge>
                      )}
                      {relatedProduct.isOnSale && (
                        <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90">Promo</Badge>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/produits/${relatedProduct.id}`} className="hover:underline">
                      <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{relatedProduct.price.toLocaleString()} FCFA</span>
                        {relatedProduct.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {relatedProduct.oldPrice.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
