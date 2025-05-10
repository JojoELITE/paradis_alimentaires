import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function Promotions() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Offres Spéciales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profitez de nos promotions exclusives et économisez sur vos produits préférés
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* First Promotion */}
          <div className="relative overflow-hidden rounded-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10" />
            <Image
              src="/images/juice.png"
              alt="Promotion jus de fruits"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
              <div className="max-w-xs">
                <h3 className="text-white text-2xl font-bold mb-2">Jus de fruits frais</h3>
                <p className="text-white/90 mb-4">Jusqu'à 30% de réduction sur une sélection de jus frais</p>
                <Link href="/promotions/fruits">
                  <Button className="bg-white text-primary hover:bg-white/90">En profiter</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Second Promotion */}
          <div className="relative overflow-hidden rounded-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-transparent z-10" />
            <Image
              src="/images/tomato.png"
              alt="Promotion produits bio"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
              <div className="max-w-xs">
                <h3 className="text-white text-2xl font-bold mb-2">Produits bio</h3>
                <p className="text-white/90 mb-4">Découvrez notre nouvelle gamme de produits biologiques</p>
                <Link href="/promotions/bio">
                  <Button className="bg-white text-green-600 hover:bg-white/90">Découvrir</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large Promotion Banner */}
        <div className="mt-8 relative overflow-hidden rounded-xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-blue/90 via-navy-blue/70 to-transparent z-10" />
          <Image
            src="/images/biscuit.png"
            alt="Promotion livraison gratuite"
            width={1200}
            height={400}
            className="w-full h-[250px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
            <div className="max-w-lg">
              <h3 className="text-white text-3xl font-bold mb-2">Livraison gratuite</h3>
              <p className="text-white/90 mb-4">Pour toute commande supérieure à 50€ - Offre valable jusqu'au 31 mai</p>
              <Link href="/promotions/livraison">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Commander maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
