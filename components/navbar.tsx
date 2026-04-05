"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, Heart, ShoppingCart, User, ChevronDown, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa"
import { FaFacebookF, FaInstagram } from "react-icons/fa6"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import LanguageSelector from "@/components/language-selector"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [categories, setCategories] = useState<{ name: string; path: string }[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems } = useCart()
  const { totalItems: totalFavorites } = useFavorites()

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (e) {
        console.error("Erreur parsing user:", e)
      }
    }
  }, [])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://ecomerce-api-aotc.onrender.com/api/categories")
        if (!res.ok) throw new Error("Erreur lors de la récupération des catégories")
        const data = await res.json()
        const formatted = data.map((cat: any) => ({
          name: cat.name,
          path: `/categories/${cat.slug || cat.name.toLowerCase()}`,
        }))
        setCategories(formatted)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCategories()
  }, [])

  // Routes
  const routes = [
    { name: "ACCUEIL", path: "/" },
    { name: "A PROPOS DE NOUS", path: "/a-propos" },
    {
      name: "CATEGORIES",
      path: "/categories",
      submenu: categories,
    },
    { name: "CONTACT", path: "/contact" },
  ]

  // Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsOpen(false)
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    })
    router.push("/")
    setIsOpen(false)
  }

  return (
    <header className={cn("w-full z-50 bg-white fixed top-0 transition-all duration-300", isScrolled && "shadow-md")}>
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative h-12 w-40 flex-shrink-0">
            <Image src="/images/logo.png" alt="Paradis Alimentaire" fill className="object-contain" priority />
          </Link>

          {/* ACTIONS MOBILES - AJOUT DES ICONES ICI */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Icône Favoris */}
            <Link href="/favoris" className="relative">
              <Heart className="h-5 w-5 text-gray-700" />
              {totalFavorites > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Icône Panier */}
            <Link href="/panier" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Bouton Menu */}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Search Desktop */}
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
            <Link href="/favoris" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700 relative">
                <Heart className="h-6 w-6" />
                {totalFavorites > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalFavorites}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/panier" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700 relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-transparent p-0">
                    <div className="bg-primary/10 rounded-full p-2">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 max-w-[120px] truncate text-sm">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-xs text-gray-500">Mon compte</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                  <DropdownMenuItem asChild>
                    <Link href="/profil" className="cursor-pointer w-full">
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/commandes" className="cursor-pointer w-full">
                      Mes commandes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favoris" className="cursor-pointer w-full">
                      Mes favoris
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "admin" || user.role === "superadmin" || user.role === "marchant") && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer w-full">
                        Mon dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center text-red-600 hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm">
                  <Link href="/connexion" className="block font-medium hover:text-primary">
                    Connexion
                  </Link>
                  <Link href="/inscription" className="block text-xs text-gray-500 hover:text-primary">
                    S'inscrire
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Desktop */}
      <div className="bg-gray-100 border-b border-gray-200 hidden md:block">
        <div className="container mx-auto px-4 flex items-center h-12 justify-between">
          <nav className="flex items-center space-x-8">
            {routes.map((route) =>
              route.submenu ? (
                <DropdownMenu key={route.path}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary flex items-center",
                        pathname.startsWith(route.path) ? "text-primary font-semibold" : "text-gray-800"
                      )}
                    >
                      {route.name}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]" sideOffset={8}>
                    {categories.length === 0 ? (
                      <DropdownMenuItem disabled>Chargement...</DropdownMenuItem>
                    ) : (
                      categories.map((item) => (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link
                            href={item.path}
                            className={cn(
                              "w-full cursor-pointer",
                              pathname === item.path && "text-primary font-medium"
                            )}
                          >
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.path ? "text-primary font-semibold" : "text-gray-800"
                  )}
                >
                  {route.name}
                </Link>
              )
            )}
          </nav>

          {/* Right Side Links Desktop */}
          <div className="flex items-center space-x-6">
            <Link href="/moyens-de-paiement" className="text-sm text-gray-800 hover:text-primary">
              Moyen de Paiement
            </Link>
            <Link href="/suivi-commande" className="text-sm text-gray-800 hover:text-primary">
              Suivre ma commande
            </Link>
            <LanguageSelector />
            <div className="flex items-center space-x-3 text-gray-800">
              <Link href="#" className="hover:text-primary transition-colors">
                <FaFacebookF className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <FaInstagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                <FaWhatsapp />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 z-50 max-h-[80vh] overflow-y-auto">
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
                      {categories.length === 0 ? (
                        <span className="text-sm text-gray-500">Chargement...</span>
                      ) : (
                        categories.map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                              "block text-sm transition-colors hover:text-primary",
                              pathname === item.path ? "text-primary font-semibold" : "text-gray-600"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={route.path}
                    className={cn(
                      "text-base font-medium py-2 transition-colors hover:text-primary block",
                      pathname === route.path ? "text-primary font-semibold" : "text-gray-800"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile User & Links - CORRECTION : AFFICHAGE SELON LE RÔLE */}
            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <div className="py-2 mb-2">
                    <p className="text-gray-800 font-medium">{user.full_name || user.email}</p>
                    <p className="text-xs text-gray-500">
                      {user.role === "admin" && "Administrateur"}
                      {user.role === "superadmin" && "Super Administrateur"}
                      {user.role === "marchant" && "Marchand"}
                      {!user.role && "Client"}
                    </p>
                  </div>

                  {/* TOUJOURS visible pour tout utilisateur connecté */}
                  <Link href="/profil" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
                    Mon profil
                  </Link>
                  <Link href="/commandes" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
                    Mes commandes
                  </Link>
                  <Link href="/favoris" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
                    Mes favoris
                  </Link>

                  {/* Dashboard UNIQUEMENT pour admin, superadmin ou marchant */}
                  {(user.role === "admin" || user.role === "superadmin" || user.role === "marchant") && (
                    <Link href="/dashboard" className="block py-2 text-primary font-medium" onClick={() => setIsOpen(false)}>
                      Mon dashboard
                    </Link>
                  )}

                  <button onClick={handleLogout} className="block py-2 text-red-600 hover:text-red-700 w-full text-left mt-2">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/connexion" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
                    Connexion
                  </Link>
                  <Link href="/inscription" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
                    Inscription
                  </Link>
                </>
              )}

              <Link href="/moyens-de-paiement" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
                Moyens de Paiement
              </Link>
              <Link href="/suivi-commande" className="block py-2 text-gray-800 hover:text-primary" onClick={() => setIsOpen(false)}>
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
                  <FaWhatsapp />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
