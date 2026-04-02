"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, Heart, ShoppingCart, User, ChevronDown, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa"
import { FaFacebookF, FaInstagram } from "react-icons/fa6"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/categories")
        if (!res.ok) throw new Error("Erreur")
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Barre du haut fixe */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300",
        isScrolled && "shadow-md"
      )}>
        {/* Première ligne : Logo + icônes mobiles */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
          {/* Logo */}
          <Link href="/" className="relative h-12 w-32 flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain" />
          </Link>

          {/* Icônes mobiles (TOUJOURS VISIBLES) */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Icône Favoris */}
            <Link href="/favoris" className="relative" onClick={() => setIsMenuOpen(false)}>
              <Heart className="h-5 w-5 text-gray-700" />
              {totalFavorites > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalFavorites}
                </span>
              )}
            </Link>

            {/* Icône Panier */}
            <Link href="/panier" className="relative" onClick={() => setIsMenuOpen(false)}>
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Icône Menu */}
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-0">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Version Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search"
                placeholder="Je recherche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button type="submit">Rechercher</Button>
            </form>
            
            <Link href="/favoris" className="relative">
              <Heart className="h-5 w-5" />
              {totalFavorites > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{totalFavorites}</span>}
            </Link>
            
            <Link href="/panier" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.full_name || user.email}</span>
                <button onClick={handleLogout} className="text-red-500 text-sm">Déconnexion</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/connexion" className="text-sm">Connexion</Link>
                <Link href="/inscription" className="text-sm">Inscription</Link>
              </div>
            )}
          </div>
        </div>

        {/* Barre de navigation desktop */}
        <div className="hidden md:block bg-gray-100 px-4 py-2">
          <div className="flex gap-6">
            <Link href="/" className={cn("text-sm", pathname === "/" && "font-bold")}>ACCUEIL</Link>
            <Link href="/a-propos" className={cn("text-sm", pathname === "/a-propos" && "font-bold")}>A PROPOS</Link>
            <div className="relative group">
              <button className="text-sm">CATEGORIES ▼</button>
              <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 p-2 min-w-[150px]">
                {categories.map(cat => (
                  <Link key={cat.path} href={cat.path} className="block py-1 text-sm hover:text-blue-600">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/contact" className={cn("text-sm", pathname === "/contact" && "font-bold")}>CONTACT</Link>
          </div>
        </div>
      </div>

      {/* MENU MOBILE - Apparaît en dessous de la barre fixe */}
      {isMenuOpen && (
        <div className="fixed top-[73px] left-0 right-0 bottom-0 bg-white z-40 overflow-y-auto md:hidden">
          <div className="p-4">
            {/* Barre de recherche mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <Input
                  type="search"
                  placeholder="Je recherche..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">OK</Button>
              </div>
            </form>

            {/* Navigation */}
            <div className="space-y-3">
              <Link href="/" className="block py-2 text-lg" onClick={() => setIsMenuOpen(false)}>
                ACCUEIL
              </Link>
              
              <Link href="/a-propos" className="block py-2 text-lg" onClick={() => setIsMenuOpen(false)}>
                A PROPOS
              </Link>
              
              {/* Catégories */}
              <div>
                <div className="py-2 text-lg font-semibold">CATEGORIES</div>
                <div className="pl-4 space-y-2">
                  {categories.map(cat => (
                    <Link 
                      key={cat.path} 
                      href={cat.path} 
                      className="block py-1 text-gray-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link href="/contact" className="block py-2 text-lg" onClick={() => setIsMenuOpen(false)}>
                CONTACT
              </Link>

              <hr className="my-4" />

              {/* Section utilisateur mobile */}
              {user ? (
                <div>
                  <div className="py-2 text-lg font-semibold">{user.full_name || user.email}</div>
                  <Link href="/profil" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                    Mon profil
                  </Link>
                  <Link href="/commandes" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                    Mes commandes
                  </Link>
                  <Link href="/favoris" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                    Mes favoris
                  </Link>
                  
                  {/* Dashboard pour admin/marchand */}
                  {(user.role === "admin" || user.role === "superadmin" || user.role === "marchant") && (
                    <Link href="/dashboard" className="block py-2 text-blue-600" onClick={() => setIsMenuOpen(false)}>
                      Mon dashboard
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} className="block py-2 text-red-500 w-full text-left">
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div>
                  <Link href="/connexion" className="block py-2 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Connexion
                  </Link>
                  <Link href="/inscription" className="block py-2 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Inscription
                  </Link>
                </div>
              )}

              <hr className="my-4" />

              <Link href="/moyens-de-paiement" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                Moyens de paiement
              </Link>
              
              <Link href="/suivi-commande" className="block py-2" onClick={() => setIsMenuOpen(false)}>
                Suivre ma commande
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Espace pour compenser la barre fixe */}
      <div className="h-[73px] md:h-[97px]"></div>
    </>
  )
}
