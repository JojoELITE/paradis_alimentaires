"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, Heart, ShoppingCart, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import CurrencySelector from "@/components/currency-selector"
import LanguageSelector from "@/components/language-selector"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const routes = [
  { name: "ACCUEIL", path: "/" },
  { name: "A PROPOS DE NOUS", path: "/a-propos" },
  {
    name: "CATEGORIES",
    path: "/categories",
    submenu: [
      { name: "Fruits", path: "/categories/fruits" },
      { name: "Légumes", path: "/categories/legumes" },
      { name: "Viandes", path: "/categories/viandes" },
      { name: "Poissons", path: "/categories/poissons" },
      { name: "Produits laitiers", path: "/categories/produits-laitiers" },
      { name: "Épicerie", path: "/categories/epicerie" },
      { name: "Boissons", path: "/categories/boissons" },
      { name: "Snacks", path: "/categories/snacks" },
    ],
  },
  { name: "CONTACT", path: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()
  const { totalItems: totalFavorites } = useFavorites()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsOpen(false)
    }
  }

  return (
    <header className={cn("w-full z-50 bg-white fixed top-0 transition-all duration-300", isScrolled && "shadow-md")}>
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative h-12 w-40 flex-shrink-0">
              <Image src="/images/logo.png" alt="Paradis Alimentaire" fill className="object-contain" priority />
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </Button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-4">
              <div className="relative w-full flex">
                <div className="border border-r-0 border-gray-300 rounded-l-md px-3 py-2 flex items-center">
                  <span className="text-sm text-gray-600">Tout</span>
                  <ChevronDown className="h-4 w-4 ml-1 text-gray-600" />
                </div>
                <Input
                  type="search"
                  placeholder="Je recherche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-none border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="submit" className="rounded-r-md rounded-l-none bg-primary hover:bg-primary/90">
                  Rechercher
                </Button>
              </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex flex-col items-center">
                <Link href="/favoris">
                  <Button variant="ghost" size="icon" className="text-gray-700 relative">
                    <Heart className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalFavorites}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center">
                <Link href="/panier">
                  <Button variant="ghost" size="icon" className="text-gray-700 relative">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="flex items-center">
                <User className="h-6 w-6 text-gray-700 mr-2" />
                <div className="text-sm">
                  <Link href="/connexion" className="font-medium hover:text-primary">
                    Connexion
                  </Link>
                  <Link href="/inscription" className="block hover:text-primary">
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {routes.map((route) =>
                route.submenu ? (
                  <DropdownMenu key={route.path}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary flex items-center",
                          pathname.startsWith(route.path) ? "text-primary font-semibold" : "text-gray-800",
                        )}
                      >
                        {route.name}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                      {route.submenu.map((item) => (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link
                            href={item.path}
                            className={cn(
                              "w-full cursor-pointer",
                              pathname === item.path && "text-primary font-medium",
                            )}
                          >
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.path ? "text-primary font-semibold" : "text-gray-800",
                    )}
                  >
                    {route.name}
                  </Link>
                ),
              )}
            </nav>

            {/* Right Side Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/moyens-de-paiement" className="text-sm text-gray-800 hover:text-primary">
                Moyen de Paiement
              </Link>
              <Link href="/suivi-commande" className="text-sm text-gray-800 hover:text-primary">
                Suivre ma commande
              </Link>
              <CurrencySelector />
              <LanguageSelector />
              <div className="flex items-center space-x-3 text-gray-800">
                <Link href="#" className="hover:text-primary transition-colors">
                  <FaFacebookF className="h-4 w-4" />
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  <FaInstagram className="h-4 w-4" />
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  <FaXTwitter className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 z-50">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Je recherche..."
              className="pl-9 w-full rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex flex-col space-y-4">
            {routes.map((route) => (
              <div key={route.path}>
                {route.submenu ? (
                  <div className="py-2">
                    <div className="font-medium text-gray-800 mb-2">{route.name}</div>
                    <div className="pl-4 space-y-2">
                      {route.submenu.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "block text-sm transition-colors hover:text-primary",
                            pathname === item.path ? "text-primary font-semibold" : "text-gray-600",
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={route.path}
                    className={cn(
                      "text-base font-medium py-2 transition-colors hover:text-primary",
                      pathname === route.path ? "text-primary font-semibold" : "text-gray-800",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center py-2">
                <Link
                  href="/panier"
                  className="flex items-center text-gray-800 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Panier ({totalItems})
                </Link>
                <Link
                  href="/favoris"
                  className="flex items-center text-gray-800 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Favoris ({totalFavorites})
                </Link>
              </div>
              <Link
                href="/moyens-de-paiement"
                className="block py-2 text-gray-800 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Moyens de Paiement
              </Link>
              <Link
                href="/suivi-commande"
                className="block py-2 text-gray-800 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Suivre ma commande
              </Link>
              <div className="py-2 flex justify-between">
                <span className="text-gray-800">Devise:</span>
                <span className="text-gray-800">FCFA</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-800">Langue:</span>
                <span className="text-gray-800">Français</span>
              </div>
              <div className="py-2 flex space-x-4 justify-center mt-2">
                <Link href="#" className="text-gray-800 hover:text-primary">
                  <FaFacebookF className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-800 hover:text-primary">
                  <FaInstagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-800 hover:text-primary">
                  <FaXTwitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
