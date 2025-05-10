import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-navy-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-16 w-40">
                <Image src="/images/logo.png" alt="Paradis Alimentaire" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-white/80">
              Paradis Alimentaire vous propose une large sélection de produits frais et de qualité pour satisfaire
              toutes vos envies culinaires.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-primary hover:bg-white/10 rounded-full"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/produits" className="text-white/80 hover:text-primary transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-white/80 hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-white/80 hover:text-primary transition-colors">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-white/80 hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/fruits" className="text-white/80 hover:text-primary transition-colors">
                  Fruits
                </Link>
              </li>
              <li>
                <Link href="/categories/legumes" className="text-white/80 hover:text-primary transition-colors">
                  Légumes
                </Link>
              </li>
              <li>
                <Link href="/categories/viandes" className="text-white/80 hover:text-primary transition-colors">
                  Viandes
                </Link>
              </li>
              <li>
                <Link href="/categories/poissons" className="text-white/80 hover:text-primary transition-colors">
                  Poissons
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/produits-laitiers"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Produits laitiers
                </Link>
              </li>
              <li>
                <Link href="/categories/epicerie" className="text-white/80 hover:text-primary transition-colors">
                  Épicerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/80">123 Avenue des Champs-Élysées, 75008 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-white/80">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-white/80">contact@paradisalimentaire.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Paradis Alimentaire. Tous droits réservés.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/mentions-legales" className="text-white/60 text-sm hover:text-primary">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="text-white/60 text-sm hover:text-primary">
              Politique de confidentialité
            </Link>
            <Link href="/conditions-generales" className="text-white/60 text-sm hover:text-primary">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
