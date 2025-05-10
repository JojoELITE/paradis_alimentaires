import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Filter } from "lucide-react"

const products = [
  {
    id: 9,
    name: "Chips Crunch",
    price: 2990,
    oldPrice: 3990,
    image: "/images/hero3.jpeg",
    category: "Snacks",
    isNew: true,
    isOnSale: true,
  },
  {
    id: 10,
    name: "Chocolat Eni",
    price: 3990,
    oldPrice: 4990,
    image: "/images/hero1.jpeg",
    category: "Snacks",
    isNew: true,
    isOnSale: true,
  },
  {
    id: 100,
    name: "Little Star - Jus d'Orange",
    price: 1500,
    oldPrice: null,
    image: "/images/product/little-star-10.jpeg",
    category: "Boissons",
    isNew: true,
    isOnSale: false,
    specialPath: "/produits/jus-little-star",
  },
  {
    id: 101,
    name: "Little Star - Jus de Mangue",
    price: 1700,
    oldPrice: null,
    image: "/images/product/little-star-7.jpeg",
    category: "Boissons",
    isNew: true,
    isOnSale: false,
    specialPath: "/produits/jus-little-star",
  },
  {
    id: 201,
    name: "Biscuits au Chocolat",
    price: 1200,
    oldPrice: 1500,
    image: "/images/biscuit.png",
    category: "Snacks",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 202,
    name: "Chips de Pommes de Terre",
    price: 990,
    oldPrice: null,
    image: "/images/hero3.jpeg",
    category: "Snacks",
    isNew: false,
    isOnSale: false,
  },
  {
    id: 203,
    name: "Barres de Céréales",
    price: 1800,
    oldPrice: 2200,
    image: "/images/biscuit.png",
    category: "Snacks",
    isNew: true,
    isOnSale: true,
  },
  {
    id: 204,
    name: "Noix Mélangées",
    price: 3500,
    oldPrice: null,
    image: "/images/grocery.png",
    category: "Snacks",
    isNew: true,
    isOnSale: false,
  },
]

export default function SnacksPage() {
  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[300px] rounded-lg overflow-hidden mb-12">
          <Image src="/images/hero3.jpeg" alt="Snacks" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8 max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-4">Snacks</h1>
              <p className="text-white/90">
                Découvrez notre sélection de snacks délicieux pour satisfaire toutes vos envies. Des chips
                croustillantes aux biscuits savoureux, trouvez le snack parfait pour chaque occasion.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>

            <div className="ml-4 flex items-center gap-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Nouveautés
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Promotions
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                Bio
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trier par:</span>
            <select className="border rounded-md p-2 text-sm">
              <option>Popularité</option>
              <option>Prix: croissant</option>
              <option>Prix: décroissant</option>
              <option>Nouveautés</option>
            </select>
          </div>
        </div>

        {/* Featured Product */}
        <div className="mb-12">
          <Link href="/produits/jus-little-star" className="block">
            <div className="relative rounded-lg overflow-hidden group">
              <Image
                src="/images/product/little-star-5.jpeg"
                alt="Little Star Jus"
                width={1200}
                height={400}
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="p-8 max-w-xl">
                  <Badge className="bg-primary hover:bg-primary/90 mb-4">Produit Vedette</Badge>
                  <h2 className="text-3xl font-bold text-white mb-4">Little Star - Jus de Fruits</h2>
                  <p className="text-white/90 mb-6">
                    Découvrez notre gamme de jus Little Star, 100% naturels et riches en vitamines. Idéal pour les
                    enfants et les adultes, ces jus délicieux sont disponibles en plusieurs saveurs.
                  </p>
                  <Button className="bg-white text-primary hover:bg-white/90">Découvrir</Button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0 relative">
                <Link href={product.specialPath || `/produits/${product.id}`}>
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
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                  <Link href={product.specialPath || `/produits/${product.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">
                      {product.id < 100 ? (product.price / 100).toLocaleString() : product.price} FCFA
                    </span>
                    {product.oldPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        {product.id < 100 ? (product.oldPrice / 100).toLocaleString() : product.oldPrice} FCFA
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="h-4 w-4" />
                  Ajouter au panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              &lt;
            </Button>
            <Button variant="outline" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline" size="icon">
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
