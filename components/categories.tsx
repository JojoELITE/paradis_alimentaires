import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const categories = [
  {
    id: 1,
    name: "Fruits",
    image: "/images/fruits.png",
    link: "/categories/fruits",
  },
  {
    id: 2,
    name: "Légumes",
    image: "/images/vegetables.png",
    link: "/categories/legumes",
  },
  {
    id: 3,
    name: "Viandes",
    image: "/images/meat.png",
    link: "/categories/viandes",
  },
  {
    id: 4,
    name: "Poissons",
    image: "/images/fish.png",
    link: "/categories/poissons",
  },
  {
    id: 5,
    name: "Produits laitiers",
    image: "/images/dairy.png",
    link: "/categories/produits-laitiers",
  },
  {
    id: 6,
    name: "Épicerie",
    image: "/images/grocery.png",
    link: "/categories/epicerie",
  },
]

export default function Categories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Catégories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre large sélection de produits frais et de qualité, soigneusement sélectionnés pour vous
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link href={category.link} key={category.id} className="group">
              <Card
                className={cn(
                  "overflow-hidden border-none shadow-md transition-all duration-300 group-hover:shadow-lg",
                  "transform group-hover:-translate-y-1",
                )}
              >
                <CardContent className="p-0 relative">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
