import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"

const products = [
  {
    id: 1,
    name: "Panier de fruits frais",
    price: 24990,
    oldPrice: 29990,
    image: "/images/fruits.png",
    category: "Fruits",
    isNew: true,
    isOnSale: true,
  },
  {
    id: 2,
    name: "Légumes bio assortis",
    price: 19990,
    oldPrice: null,
    image: "/images/vegetables.png",
    category: "Légumes",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 3,
    name: "Filet de saumon premium",
    price: 15990,
    oldPrice: 18990,
    image: "/images/fish.png",
    category: "Poissons",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 4,
    name: "Fromage artisanal",
    price: 8990,
    oldPrice: null,
    image: "/images/dairy.png",
    category: "Produits laitiers",
    isNew: false,
    isOnSale: false,
  },
  {
    id: 5,
    name: "Viande de bœuf premium",
    price: 22990,
    oldPrice: 25990,
    image: "/images/meat.png",
    category: "Viandes",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 6,
    name: "Huile d'olive extra vierge",
    price: 12990,
    oldPrice: null,
    image: "/images/grocery.png",
    category: "Épicerie",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 7,
    name: "Jus de fruits frais",
    price: 9990,
    oldPrice: 11990,
    image: "/images/juice.png",
    category: "Boissons",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 8,
    name: "Biscuits artisanaux",
    price: 14990,
    oldPrice: null,
    image: "/images/biscuit.png",
    category: "Épicerie",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 9,
    name: "Tomates fraîches bio",
    price: 4990,
    oldPrice: 6990,
    image: "/images/tomato.png",
    category: "Légumes",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 10,
    name: "Assortiment de fromages",
    price: 18990,
    oldPrice: null,
    image: "/images/dairy.png",
    category: "Produits laitiers",
    isNew: true,
    isOnSale: false,
  },
  {
    id: 11,
    name: "Jus d'orange pressé",
    price: 7990,
    oldPrice: 9990,
    image: "/images/juice.png",
    category: "Boissons",
    isNew: false,
    isOnSale: true,
  },
  {
    id: 12,
    name: "Biscuits au chocolat",
    price: 5990,
    oldPrice: null,
    image: "/images/biscuit.png",
    category: "Épicerie",
    isNew: true,
    isOnSale: false,
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
]

export default function ProduitsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-32">
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nos Produits</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre large sélection de produits frais et de qualité, soigneusement sélectionnés pour vous
            </p>
          </div>

          {/* Featured Product */}
          <div className="mb-12">
            <Link href="/produits/jus-little-star" className="block">
              <div className="relative rounded-lg overflow-hidden group">
                <Image
                  src="/images/product/little-star-1.jpeg"
                  alt="Little Star Jus"
                  width={1200}
                  height={400}
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="p-8 max-w-xl">
                    <Badge className="bg-primary hover:bg-primary/90 mb-4">Nouveau Produit</Badge>
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

          {/* Filters */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="outline" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
