"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FaFacebookF, FaGoogle } from "react-icons/fa6"
import { Eye, EyeOff, Store, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [userType, setUserType] = useState<"client" | "marchant">("client")
  const [storeName, setStoreName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("=== DÉBUT INSCRIPTION ===")
    console.log("Type d'utilisateur:", userType)
    
    // Validation
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    if (password.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions générales",
        variant: "destructive",
      })
      return
    }

    if (userType === "marchant" && !storeName) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer le nom de votre boutique",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const fullName = `${firstName} ${lastName}`.trim()
      
      // Pour un marchand, envoyer le rôle "marchant" (en anglais)
      const role = userType === "marchant" ? "marchant" : "client"
      
      console.log("Envoi au serveur:", {
        full_name: fullName,
        email,
        role,
      })
      
      const res = await fetch('http://localhost:3333/api/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: role,
        }),
      })

      const data = await res.json()

      console.log("Réponse du serveur:", data)
      
      if (res.ok && data.success) {
        toast({
          title: "Inscription réussie",
          description: userType === "marchant" 
            ? "Votre boutique a été créée avec succès! Vous pouvez maintenant vous connecter."
            : "Votre compte a été créé avec succès! Vous pouvez maintenant vous connecter.",
        })
        
        setTimeout(() => {
          router.push('/connexion')
        }, 1500)
      } else {
        let errorMessage = data.message || "Une erreur est survenue lors de l'inscription"
        
        if (data.errors && typeof data.errors === 'string') {
          errorMessage = data.errors
        } else if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map((err: any) => err.message).join(', ')
        }
        
        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast({
        title: "Erreur d'inscription",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/images/logo.png" alt="Paradis Alimentaire" width={150} height={60} className="mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold mt-6">Créer un compte</h1>
          <p className="text-muted-foreground mt-2">
            Rejoignez Paradis Alimentaire pour profiter d'une expérience d'achat personnalisée
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de compte */}
            <div>
              <Label className="mb-2 block">Type de compte</Label>
              <div className="space-y-2">
                <div 
                  className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    userType === "client" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setUserType("client")}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    userType === "client" ? "border-primary" : "border-gray-400"
                  }`}>
                    {userType === "client" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <User className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <span className="font-medium">Client</span>
                    <p className="text-xs text-gray-500">Acheter des produits sur la plateforme</p>
                  </div>
                </div>
                
                <div 
                  className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                    userType === "marchant" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setUserType("marchant")}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    userType === "marchant" ? "border-primary" : "border-gray-400"
                  }`}>
                    {userType === "marchant" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <Store className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <span className="font-medium">Marchand</span>
                    <p className="text-xs text-gray-500">Vendre vos produits sur la plateforme</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Le mot de passe doit contenir au moins 8 caractères</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Champs pour les marchands */}
            {userType === "marchant" && (
              <div>
                <Label htmlFor="storeName">Nom de la boutique</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ma Super Boutique"
                  required
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                J'accepte les{" "}
                <Link href="/conditions-generales" className="text-primary hover:underline">
                  conditions générales
                </Link>{" "}
                et la{" "}
                <Link href="/politique-de-confidentialite" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Création en cours..." : userType === "marchant" ? "Créer ma boutique" : "Créer un compte"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <FaFacebookF className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button variant="outline" className="w-full">
              <FaGoogle className="h-4 w-4 mr-2 text-red-500" />
              Google
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <Link href="/connexion" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}