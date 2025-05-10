import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import Categories from "@/components/categories"
import Promotions from "@/components/promotions"
import Newsletter from "@/components/newsletter"
import Testimonials from "@/components/testimonials"
import Banner from "@/components/banner"
import MoyensPaiement from "@/components/moyens-paiement"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-24 overflow-x-hidden">
      <div className="w-full">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <div className="container mx-auto px-4 py-8">
          <Banner
            title="Découvrez nos snacks délicieux"
            description="Profitez de nos snacks de qualité, parfaits pour une pause gourmande à tout moment de la journée."
            buttonText="Découvrir"
            buttonLink="/categories/snacks"
            image="/images/hero3.jpeg"
            bgColor="bg-navy-blue"
            position="left"
          />
        </div>
        <Promotions />
        <div className="container mx-auto px-4 py-8">
          <Banner
            title="Chocolats et confiseries"
            description="Laissez-vous tenter par notre sélection de chocolats et confiseries pour satisfaire vos envies sucrées."
            buttonText="Voir les produits"
            buttonLink="/categories/confiseries"
            image="/images/hero1.jpeg"
            bgColor="bg-logo-red"
            position="right"
          />
        </div>
        <Testimonials />
        <MoyensPaiement />
        <Newsletter />
      </div>
    </main>
  )
}
