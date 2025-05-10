import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, User } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Les bienfaits des jus de fruits frais",
    excerpt:
      "Découvrez pourquoi les jus de fruits frais sont essentiels pour votre santé et comment les intégrer à votre alimentation quotidienne.",
    image: "/images/juice.png",
    date: "10 Mai 2023",
    author: "Sophie Martin",
    readTime: "5 min",
    category: "Nutrition",
  },
  {
    id: 2,
    title: "Comment choisir des légumes de saison",
    excerpt:
      "Guide complet pour sélectionner les meilleurs légumes de saison et profiter de tous leurs bienfaits nutritionnels.",
    image: "/images/vegetables.png",
    date: "5 Mai 2023",
    author: "Thomas Dubois",
    readTime: "7 min",
    category: "Conseils",
  },
  {
    id: 3,
    title: "Recettes gourmandes avec nos biscuits artisanaux",
    excerpt: "Découvrez des recettes délicieuses et faciles à réaliser avec notre gamme de biscuits artisanaux.",
    image: "/images/biscuit.png",
    date: "1 Mai 2023",
    author: "Marie Leroy",
    readTime: "10 min",
    category: "Recettes",
  },
  {
    id: 4,
    title: "Les tomates : un aliment aux multiples vertus",
    excerpt: "Tout ce que vous devez savoir sur les tomates, leurs bienfaits pour la santé et comment les cuisiner.",
    image: "/images/tomato.png",
    date: "28 Avril 2023",
    author: "Pierre Moreau",
    readTime: "6 min",
    category: "Nutrition",
  },
  {
    id: 5,
    title: "Comment conserver vos fruits plus longtemps",
    excerpt: "Astuces et conseils pour prolonger la fraîcheur de vos fruits et éviter le gaspillage alimentaire.",
    image: "/images/fruits.png",
    date: "25 Avril 2023",
    author: "Julie Bernard",
    readTime: "8 min",
    category: "Conseils",
  },
  {
    id: 6,
    title: "Les secrets d'une alimentation équilibrée",
    excerpt: "Guide complet pour adopter une alimentation saine et équilibrée au quotidien.",
    image: "/images/grocery.png",
    date: "20 Avril 2023",
    author: "Sophie Martin",
    readTime: "12 min",
    category: "Nutrition",
  },
]

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-32">
      <section className="py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Notre Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos articles, conseils et astuces pour une alimentation saine et équilibrée
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image src="/images/juice.png" alt={blogPosts[0].title} fill className="object-cover" />
                </div>
                <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="text-sm text-primary font-medium mb-2">{blogPosts[0].category}</div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{blogPosts[0].author}</span>
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span className="mr-4">{blogPosts[0].date}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <Link href={`/blog/${blogPosts[0].id}`}>
                    <Button className="bg-primary hover:bg-primary/90">Lire l'article</Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">{post.category}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link href={`/blog/${post.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Lire l'article
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
