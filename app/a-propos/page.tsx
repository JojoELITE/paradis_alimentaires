import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, ShieldCheck, Truck, Award, Leaf } from "lucide-react"
import Banner from "@/components/banner"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Banner Section */}
        <div className="mb-16">
          <Banner
            title="À propos de Paradis Alimentaire"
            description="Découvrez notre histoire, notre mission et notre engagement envers la qualité et la satisfaction de nos clients."
            buttonText="Nos produits"
            buttonLink="/produits"
            image="/images/grocery.png"
            bgColor="bg-navy-blue"
            position="left"
          />
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
            <p className="text-muted-foreground mb-4">
              Fondé en 2010, Paradis Alimentaire est né de la passion de deux amis pour les produits frais et de
              qualité. Notre voyage a commencé sur un petit marché local, où nous avons découvert le plaisir de proposer
              des produits frais directement des producteurs aux consommateurs.
            </p>
            <p className="text-muted-foreground mb-4">
              Au fil des années, nous avons grandi pour devenir l'un des principaux fournisseurs de produits
              alimentaires de qualité, tout en conservant notre engagement envers l'excellence et la fraîcheur.
            </p>
            <p className="text-muted-foreground">
              Aujourd'hui, Paradis Alimentaire est fier de servir des milliers de clients satisfaits, en leur offrant
              une expérience d'achat exceptionnelle et des produits qui répondent aux normes les plus élevées.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/images/grocery.png" alt="Notre histoire" fill className="object-cover" />
          </div>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Mission</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Chez Paradis Alimentaire, notre mission est de fournir des produits alimentaires frais et de qualité
              supérieure, tout en soutenant les producteurs locaux et en promouvant des pratiques durables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fraîcheur</h3>
              <p className="text-muted-foreground">
                Nous nous engageons à offrir les produits les plus frais, sélectionnés avec soin pour garantir une
                qualité optimale.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Qualité</h3>
              <p className="text-muted-foreground">
                Nous ne compromettons jamais sur la qualité, en veillant à ce que chaque produit réponde à nos normes
                strictes.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Communauté</h3>
              <p className="text-muted-foreground">
                Nous soutenons les producteurs locaux et contribuons activement au développement de notre communauté.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi nous choisir</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Découvrez ce qui fait de Paradis Alimentaire le choix privilégié pour vos besoins alimentaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 flex">
              <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Produits de qualité supérieure</h3>
                <p className="text-muted-foreground">
                  Nous sélectionnons soigneusement chaque produit pour garantir la meilleure qualité possible à nos
                  clients.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 flex">
              <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Livraison rapide et fiable</h3>
                <p className="text-muted-foreground">
                  Notre service de livraison efficace vous assure de recevoir vos produits frais dans les meilleurs
                  délais.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 flex">
              <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Satisfaction garantie</h3>
                <p className="text-muted-foreground">
                  Nous nous engageons à assurer votre satisfaction totale avec chaque achat que vous effectuez.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 flex">
              <div className="flex-shrink-0 h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Service client exceptionnel</h3>
                <p className="text-muted-foreground">
                  Notre équipe dévouée est toujours prête à vous aider et à répondre à toutes vos questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-lg shadow-md overflow-hidden mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">Rejoignez la famille Paradis Alimentaire</h2>
              <p className="text-white/90 mb-6">
                Découvrez notre sélection de produits frais et de qualité. Commandez dès aujourd'hui et profitez d'une
                expérience d'achat exceptionnelle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/produits">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Découvrir nos produits
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Contactez-nous
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-auto">
              <Image src="/images/fruits.png" alt="Nos produits" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Rencontrez les personnes passionnées qui travaillent chaque jour pour vous offrir le meilleur service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={`/placeholder.svg?height=300&width=300`}
                    alt={`Membre de l'équipe ${member}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold">Nom du membre {member}</h3>
                  <p className="text-primary">Poste</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Description courte du membre de l'équipe et de son rôle dans l'entreprise.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
