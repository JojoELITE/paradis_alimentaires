"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { toast } from "@/components/ui/use-toast"

// Variantes du produit
const productVariants = [
  {
    id: "orange",
    name: "Jus d'Orange",
    price: 1500,
    image: "/images/product/little-star-10.jpeg",
    description: "Jus d'orange 100% naturel, riche en vitamine C et délicieusement rafraîchissant.",
  },
  {
    id: "mangue",
    name: "Jus de Mangue",
    price: 1700,
    image: "/images/product/little-star-7.jpeg",
    description: "Jus de mangue exotique, savoureux et nutritif, idéal pour les enfants et les adultes.",
  },
]

// Images du produit
const productImages = [
  "/images/product/little-star-1.jpeg",
  "/images/product/little-star-2.jpeg",
  "/images/product/little-star-3.jpeg",
  "/images/product/little-star-4.jpeg",
  "/images/product/little-star-5.jpeg",
  "/images/product/little-star-6.jpeg",
  "/images/product/little-star-8.jpeg",
  "/images/product/little-star-9.jpeg",
]

export default function LittleStarProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(productVariants[0])
  const { addItem } = useCart()
  const { addItem: addToFavorites, removeItem: removeFromFavorites, isFavorite } = useFavorites()

  const handleAddToCart = () => {
    addItem({
      id: 100 + productVariants.findIndex((v) => v.id === selectedVariant.id),
      name: `Little Star - ${selectedVariant.name}`,
      price: selectedVariant.price,
      image: selectedVariant.image,
      quantity,
      category: "Boissons",
    })

    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} × Little Star - ${selectedVariant.name} a été ajouté à votre panier.`,
    })
  }

  const handleToggleFavorite = () => {
    const productId = 100 + productVariants.findIndex((v) => v.id === selectedVariant.id)

    if (isFavorite(productId)) {
      removeFromFavorites(productId)
      toast({
        title: "Produit retiré des favoris",
        description: `Little Star - ${selectedVariant.name} a été retiré de vos favoris.`,
      })
    } else {
      addToFavorites({
        id: productId,
        name: `Little Star - ${selectedVariant.name}`,
        price: selectedVariant.price,
        image: selectedVariant.image,
        category: "Boissons",
      })
      toast({
        title: "Produit ajouté aux favoris",
        description: `Little Star - ${selectedVariant.name} a été ajouté à vos favoris.`,
      })
    }
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
          <Link href="/categories/boissons" className="hover:text-primary">
            Boissons
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Little Star - {selectedVariant.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={activeImage === 0 ? selectedVariant.image : productImages[activeImage - 1]}
                alt={`Little Star - ${selectedVariant.name}`}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">Nouveau</Badge>
              <Badge className="absolute top-4 right-4 bg-primary hover:bg-primary/90">Populaire</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div
                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImage === 0 ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setActiveImage(0)}
              >
                <Image
                  src={selectedVariant.image || "/placeholder.svg"}
                  alt={`Little Star - ${selectedVariant.name} - Image principale`}
                  fill
                  className="object-cover"
                />
              </div>
              {productImages.slice(0, 7).map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImage === index + 1 ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index + 1)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Little Star - ${selectedVariant.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Little Star - {selectedVariant.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">5.0 (24 avis)</span>
            </div>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-primary">{selectedVariant.price} FCFA</span>
              <Badge className="ml-3 bg-primary/10 text-primary hover:bg-primary/20 border-none">Promo</Badge>
            </div>

            <p className="text-muted-foreground mb-6">{selectedVariant.description}</p>

            {/* Variant Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Saveur:</h3>
              <div className="flex flex-wrap gap-3">
                {productVariants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant.id === variant.id ? "default" : "outline"}
                    className={selectedVariant.id === variant.id ? "bg-primary hover:bg-primary/90" : ""}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Disponibilité:</span>
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  En stock (50+ disponibles)
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Catégorie:</span>
                <Link href="/categories/boissons" className="text-primary hover:underline">
                  Boissons
                </Link>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Marque:</span>
                <span>Little Star</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Contenance:</span>
                <span>200ml</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Origine:</span>
                <span>Gabon</span>
              </div>
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
                      onClick={() => setQuantity(Math.min(50, quantity + 1))}
                      disabled={quantity >= 50}
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
                  <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleToggleFavorite}>
                    <Heart
                      className={`h-5 w-5 ${isFavorite(100 + productVariants.findIndex((v) => v.id === selectedVariant.id)) ? "fill-primary text-primary" : ""}`}
                    />
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
                value="nutrition"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6"
              >
                Informations nutritionnelles
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-6"
              >
                Avis (24)
              </TabsTrigger>
            </TabsList>
            <div className="bg-white rounded-lg shadow-md mt-4 p-6">
              <TabsContent value="description" className="mt-0">
                <h3 className="text-xl font-semibold mb-4">Description du produit</h3>
                <p className="text-muted-foreground">
                  Little Star est une boisson rafraîchissante à base de fruits, spécialement conçue pour les enfants et
                  les adultes. Fabriqué avec des ingrédients de qualité, ce jus de fruit est riche en vitamines et
                  minéraux essentiels pour une alimentation équilibrée.
                </p>
                <p className="text-muted-foreground mt-4">
                  Notre jus {selectedVariant.name.toLowerCase()} est élaboré à partir de fruits soigneusement
                  sélectionnés pour leur qualité et leur goût exceptionnel. Sans conservateurs artificiels, Little Star
                  offre une expérience gustative authentique et naturelle.
                </p>
                <p className="text-muted-foreground mt-4">
                  Idéal pour les goûters, les déjeuners ou comme rafraîchissement à tout moment de la journée, Little
                  Star est conditionné dans un emballage pratique et facile à transporter.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Caractéristiques:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>100% jus de fruits naturel</li>
                    <li>Riche en vitamines et minéraux</li>
                    <li>Sans conservateurs artificiels</li>
                    <li>Emballage pratique de 200ml</li>
                    <li>Idéal pour les enfants et les adultes</li>
                    <li>Favorise la croissance et le développement</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="nutrition" className="mt-0">
                <h3 className="text-xl font-semibold mb-4">Informations nutritionnelles</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nutriment</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Pour 100ml</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                          Par portion (200ml)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Énergie</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">45 kcal</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">90 kcal</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Matières grasses</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">0 g</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">0 g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Glucides</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">11 g</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">22 g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">dont sucres</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">11 g</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">22 g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Protéines</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">0.5 g</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">1 g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Sel</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">0.01 g</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">0.02 g</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">Vitamine C</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">30 mg (38% AJR*)</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-500">60 mg (75% AJR*)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">*AJR: Apports Journaliers Recommandés</p>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Ingrédients:</h4>
                  <p className="text-muted-foreground">
                    Jus de {selectedVariant.id === "orange" ? "orange" : "mangue"} à base de concentré (100%), vitamine
                    C, arôme naturel.
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Conservation:</h4>
                  <p className="text-muted-foreground">
                    À conserver dans un endroit frais et sec. Après ouverture, conserver au réfrigérateur et consommer
                    dans les 3 jours.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-0">
                <h3 className="text-xl font-semibold mb-4">Avis clients</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <div className="text-5xl font-bold text-primary mb-2">5.0</div>
                    <div className="flex justify-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Basé sur 24 avis</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      {/* Sample reviews */}
                      {[
                        {
                          name: "Sophie M.",
                          rating: 5,
                          date: "Il y a 2 jours",
                          comment:
                            "Mes enfants adorent ce jus ! Le goût est excellent et j'apprécie qu'il soit naturel sans conservateurs artificiels. L'emballage est pratique pour les goûters à l'école.",
                        },
                        {
                          name: "Thomas D.",
                          rating: 5,
                          date: "Il y a 1 semaine",
                          comment:
                            "Très bon rapport qualité-prix. Le goût est authentique et rafraîchissant. Je recommande vivement ce produit pour toute la famille.",
                        },
                        {
                          name: "Marie L.",
                          rating: 5,
                          date: "Il y a 2 semaines",
                          comment:
                            "J'achète régulièrement ce jus pour mes enfants. Ils l'adorent et je suis rassurée de leur donner un produit de qualité. La livraison est toujours rapide et le produit bien emballé.",
                        },
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{review.name}</h4>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
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
            {[
              {
                id: 101,
                name: "Jus de Fruits Tropicaux",
                price: 1800,
                image: "/images/juice.png",
                category: "Boissons",
                isNew: true,
                isOnSale: false,
              },
              {
                id: 102,
                name: "Jus de Pomme Bio",
                price: 1600,
                oldPrice: 1900,
                image: "/images/juice.png",
                category: "Boissons",
                isNew: false,
                isOnSale: true,
              },
              {
                id: 103,
                name: "Smoothie aux Fruits Rouges",
                price: 2200,
                image: "/images/juice.png",
                category: "Boissons",
                isNew: true,
                isOnSale: false,
              },
              {
                id: 104,
                name: "Eau de Coco Naturelle",
                price: 2500,
                oldPrice: 2800,
                image: "/images/juice.png",
                category: "Boissons",
                isNew: false,
                isOnSale: true,
              },
            ].map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <Link href={`/produits/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Nouveau</Badge>
                    )}
                    {product.isOnSale && (
                      <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90">Promo</Badge>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/produits/${product.id}`} className="hover:underline">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{product.price} FCFA</span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">{product.oldPrice} FCFA</span>
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
