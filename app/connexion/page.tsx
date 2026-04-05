"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaFacebookF, FaGoogle } from "react-icons/fa6"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('https://ecomerce-api-aotc.onrender.com//api/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()
      console.log('Login response:', data)

      if (res.ok && data.success) {
        // Vérifier que l'uuid est présent
        if (!data.user.id) {
          console.error("L'utilisateur n'a pas d'uuid:", data.user)
          toast({
            title: "Erreur",
            description: "Données utilisateur incomplètes",
            variant: "destructive",
          })
          return
        }

        // Stocker le token et l'utilisateur
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Mettre à jour le hook useAuth
        login(data.user, data.token)

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Paradis Alimentaire!",
        })

        router.push('/')
      } else {
        toast({
          title: "Erreur de connexion",
          description: data.message || "Email ou mot de passe incorrect",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Erreur de connexion",
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
          <h1 className="text-2xl font-bold mt-6">Connexion</h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous à votre compte pour accéder à vos commandes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
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
              Pas encore de compte?{" "}
              <Link href="/inscription" className="text-primary font-medium hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}