import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Filter } from "lucide-react"

// Définition des catégories
const categories = [
  {
    slug: "fruits",
    name: "Fruits",
    description:
      "Découvrez notre sélection de fruits frais et savoureux, soigneusement sélectionnés pour leur qualité et leur goût exceptionnel.",
    image: "/images/fruits.png",
  },
  {
    slug: "legumes",
    name: "Légumes",
    description: "Explorez notre gamme de légumes frais, cultivés avec soin pour vous offrir le meilleur de la nature.",
    image: "/images/vegetables.png",
  },
  {
    slug: "viandes",
    name: "Viandes",
    description:
      "Savourez nos viandes de qualité supérieure, sélectionnées pour leur tendreté et leur saveur incomparable.",
    image: "/images/meat.png",
  },
  {
    slug: "poissons",
    name: "Poissons",
    description: "Découvrez notre sélection de poissons frais, pêchés dans le respect de l'environnement.",
    image: "/images/fish.png",
  },
  {
    slug: "produits-laitiers",
    name: "Produits laitiers",
    description:
      "Explorez notre gamme de produits laitiers, élaborés avec le plus grand soin pour vous offrir des saveurs authentiques.",
    image: "/images/dairy.png",
  },
  {
    slug: "epicerie",
    name: "Épicerie",
    description:
      "Découvrez notre sélection de produits d'épicerie fine, soigneusement choisis pour leur qualité et leur authenticité.",
    image: "/images/grocery.png",
  },
]

// Produits par catégorie
const productsByCategory = {
  fruits: [
    {
      id: 1,
      name: "Panier de fruits frais",
      price: 24.99,
      oldPrice: 29.99,
      image: "/images/fruits.png",
      category: "Fruits",
      isNew: true,
      isOnSale: true,
    },
    {
      id: 2,
      name: "Pommes Bio",
      price: 5.99,
      oldPrice: null,
      image: "/images/fruits.png",
      category: "Fruits",
      isNew: false,
      isOnSale: false,
    },
    {
      id: 3,
      name: "Bananes Premium",
      price: 4.99,
      oldPrice: 6.99,
      image: "/images/fruits.png",
      category: "Fruits",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 4,
      name: "Oranges Juteuses",
      price: 7.99,
      oldPrice: null,
      image: "/images/fruits.png",
      category: "Fruits",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 5,
      name: "Mangues Exotiques",
      price: 12.99,
      oldPrice: 15.99,
      image: "/images/fruits.png",
      category: "Fruits",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 6,
      name: "Fraises Fraîches",
      price: 8.99,
      oldPrice: null,
      image: "/images/fruits.png",
      category: "Fruits",
      isNew: true,
      isOnSale: false,
    },
  ],
  legumes: [
    {
      id: 1,
      name: "Légumes bio assortis",
      price: 19.99,
      oldPrice: null,
      image: "/images/vegetables.png",
      category: "Légumes",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 2,
      name: "Tomates Fraîches",
      price: 3.99,
      oldPrice: 4.99,
      image: "/images/tomato.png",
      category: "Légumes",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 3,
      name: "Carottes Bio",
      price: 2.99,
      oldPrice: null,
      image: "/images/vegetables.png",
      category: "Légumes",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 4,
      name: "Poivrons Colorés",
      price: 5.99,
      oldPrice: 7.99,
      image: "/images/vegetables.png",
      category: "Légumes",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 5,
      name: "Courgettes Fraîches",
      price: 4.49,
      oldPrice: null,
      image: "/images/vegetables.png",
      category: "Légumes",
      isNew: false,
      isOnSale: false,
    },
    {
      id: 6,
      name: "Aubergines Bio",
      price: 6.99,
      oldPrice: 8.99,
      image: "/images/vegetables.png",
      category: "Légumes",
      isNew: true,
      isOnSale: true,
    },
  ],
  viandes: [
    {
      id: 1,
      name: "Viande de bœuf premium",
      price: 22.99,
      oldPrice: 25.99,
      image: "/images/meat.png",
      category: "Viandes",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 2,
      name: "Poulet Fermier",
      price: 15.99,
      oldPrice: null,
      image: "/images/meat.png",
      category: "Viandes",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 3,
      name: "Côtes d'Agneau",
      price: 18.99,
      oldPrice: 21.99,
      image: "/images/meat.png",
      category: "Viandes",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 4,
      name: "Filet de Porc",
      price: 14.99,
      oldPrice: null,
      image: "/images/meat.png",
      category: "Viandes",
      isNew: false,
      isOnSale: false,
    },
    {
      id: 5,
      name: "Steak Haché Bio",
      price: 12.99,
      oldPrice: 14.99,
      image: "/images/meat.png",
      category: "Viandes",
      isNew: true,
      isOnSale: true,
    },
    {
      id: 6,
      name: "Saucisses Artisanales",
      price: 9.99,
      oldPrice: null,
      image: "/images/meat.png",
      category: "Viandes",
      isNew: true,
      isOnSale: false,
    },
  ],
  poissons: [
    {
      id: 1,
      name: "Filet de saumon premium",
      price: 15.99,
      oldPrice: 18.99,
      image: "/images/fish.png",
      category: "Poissons",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 2,
      name: "Thon Frais",
      price: 19.99,
      oldPrice: null,
      image: "/images/fish.png",
      category: "Poissons",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 3,
      name: "Crevettes Sauvages",
      price: 16.99,
      oldPrice: 19.99,
      image: "/images/fish.png",
      category: "Poissons",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 4,
      name: "Filet de Cabillaud",
      price: 14.99,
      oldPrice: null,
      image: "/images/fish.png",
      category: "Poissons",
      isNew: false,
      isOnSale: false,
    },
    {
      id: 5,
      name: "Moules Fraîches",
      price: 9.99,
      oldPrice: 12.99,
      image: "/images/fish.png",
      category: "Poissons",
      isNew: true,
      isOnSale: true,
    },
    {
      id: 6,
      name: "Dorade Entière",
      price: 17.99,
      oldPrice: null,
      image: "/images/fish.png",
      category: "Poissons",
      isNew: true,
      isOnSale: false,
    },
  ],
  "produits-laitiers": [
    {
      id: 1,
      name: "Fromage artisanal",
      price: 8.99,
      oldPrice: null,
      image: "/images/dairy.png",
      category: "Produits laitiers",
      isNew: false,
      isOnSale: false,
    },
    {
      id: 2,
      name: "Yaourt Nature Bio",
      price: 4.99,
      oldPrice: 5.99,
      image: "/images/dairy.png",
      category: "Produits laitiers",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 3,
      name: "Beurre de Baratte",
      price: 6.99,
      oldPrice: null,
      image: "/images/dairy.png",
      category: "Produits laitiers",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 4,
      name: "Crème Fraîche",
      price: 3.99,
      oldPrice: 4.99,
      image: "/images/dairy.png",
      category: "Produits laitiers",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 5,
      name: "Lait Bio",
      price: 2.99,
      oldPrice: null,
      image: "/images/dairy.png",
      category: "Produits laitiers",
      isNew: false,
      isOnSale: false,
    },
    {
      id: 6,
      name: "Fromage de Chèvre",
      price: 7.99,
      oldPrice: 9.99,
      image: "/images/dairy.png",
      category: "Produits laitiers",
      isNew: true,
      isOnSale: true,
    },
  ],
  epicerie: [
    {
      id: 1,
      name: "Huile d'olive extra vierge",
      price: 12.99,
      oldPrice: null,
      image: "/images/grocery.png",
      category: "Épicerie",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 2,
      name: "Miel naturel",
      price: 9.99,
      oldPrice: 11.99,
      image: "/images/grocery.png",
      category: "Épicerie",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 3,
      name: "Biscuits artisanaux",
      price: 14.99,
      oldPrice: null,
      image: "/images/biscuit.png",
      category: "Épicerie",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 4,
      name: "Jus de fruits frais",
      price: 9.99,
      oldPrice: 11.99,
      image: "/images/juice.png",
      category: "Épicerie",
      isNew: false,
      isOnSale: true,
    },
    {
      id: 5,
      name: "Thé Bio",
      price: 8.99,
      oldPrice: null,
      image: "/images/grocery.png",
      category: "Épicerie",
      isNew: true,
      isOnSale: false,
    },
    {
      id: 6,
      name: "Chocolat Artisanal",
      price: 6.99,
      oldPrice: 8.99,
      image: "/images/grocery.png",
      category: "Épicerie",
      isNew: false,
      isOnSale: true,
    },
  ],
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Trouver la catégorie correspondante
  const category = categories.find((cat) => cat.slug === slug)

  // Si la catégorie n'existe pas, retourner une page 404
  if (!category) {
    notFound()
  }

  // Récupérer les produits de cette catégorie
  const products = productsByCategory[slug as keyof typeof productsByCategory] || []

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="relative h-[300px] rounded-lg overflow-hidden mb-12">
          <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8 max-w-xl">
              <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
              <p className="text-white/90">{category.description}</p>
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-0 relative">
                <Link href={`/produits/${product.id}`}>
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
                  <Link href={`/produits/${product.id}`} className="hover:underline">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{product.price.toLocaleString()} FCFA</span>
                    {product.oldPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        {product.oldPrice.toLocaleString()} FCFA
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
            <Button variant="outline">3</Button>
            <Button variant="outline" size="icon">
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
