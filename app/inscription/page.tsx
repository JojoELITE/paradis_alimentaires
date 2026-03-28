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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
  const [userType, setUserType] = useState<"client" | "marchand">("client")
  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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

    if (userType === "marchand" && !storeName) {
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
      
      const res = await fetch('https://ecomerce-api-1-dp0w.onrender.com/api/client/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: userType === "marchand" ? "marchand" : "client",
          store_name: userType === "marchand" ? storeName : null,
          store_description: userType === "marchand" ? storeDescription : null,
        }),
      })

      const data = await res.json()

      console.log(data)
      if (res.ok && data.success) {
        toast({
          title: "Inscription réussie",
          description: userType === "marchand" 
            ? "Votre boutique a été créée avec succès! Vous pouvez maintenant vous connecter."
            : "Votre compte a été créé avec succès! Vous pouvez maintenant vous connecter.",
        })
        
        // Redirection vers la page de connexion
        router.push('/connexion')
      } else {
        let errorMessage = data.message || "Une erreur est survenue lors de l'inscription"
        
        if (data.errors && Array.isArray(data.errors)) {
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
              <RadioGroup
                value={userType}
                onValueChange={(value) => setUserType(value as "client" | "marchand")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="flex items-center cursor-pointer flex-1">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">Client</span>
                      <p className="text-xs text-gray-500">Acheter des produits sur la plateforme</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="marchand" id="marchand" />
                  <Label htmlFor="marchand" className="flex items-center cursor-pointer flex-1">
                    <Store className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <span className="font-medium">Marchand</span>
                      <p className="text-xs text-gray-500">Vendre vos produits sur la plateforme</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
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

            {/* Champs supplémentaires pour les marchands */}
            {userType === "marchand" && (
              <>
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
                <div>
                  <Label htmlFor="storeDescription">Description de la boutique (optionnel)</Label>
                  <textarea
                    id="storeDescription"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Décrivez votre boutique..."
                    rows={3}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </>
            )}

            <div className="flex items-start">
              <Checkbox 
                id="terms" 
                className="mt-1" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                required 
              />
              <Label htmlFor="terms" className="ml-2 text-sm cursor-pointer">
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
              {isLoading ? "Création en cours..." : userType === "marchand" ? "Créer ma boutique" : "Créer un compte"}
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