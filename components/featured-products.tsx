"use client"
import { Button } from "@/components/ui/button"
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
]

export default function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Produits Populaires</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos produits les plus appréciés par nos clients, sélectionnés avec soin pour leur qualité
            exceptionnelle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/produits">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
