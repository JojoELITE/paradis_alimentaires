"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, ShoppingBag, Heart, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const { totalItems: totalFavorites } = useFavorites()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: ""
  })

  // Rediriger si non connecté

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Appel API pour mettre à jour le profil
      const response = await fetch("http://localhost:3333/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Mettre à jour le localStorage
        const updatedUser = { ...user, ...formData }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès.",
        })
        setIsEditing(false)
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    })
    router.push("/")
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </main>
    )
  }

  const initials = user.full_name
    ? user.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">Gérez vos informations personnelles et suivez votre activité</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold text-gray-900">{user.full_name || user.email}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <Badge className="mt-3 bg-primary/10 text-primary hover:bg-primary/20">
                    {user.role === "client" ? "Client" : user.role === "admin" ? "Administrateur" : "Super Administrateur"}
                  </Badge>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <Link href="/commandes" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span className="text-gray-700 group-hover:text-primary">Mes commandes</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                  </Link>
                  <Link href="/favoris" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-gray-700 group-hover:text-primary">Mes favoris</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {totalFavorites > 0 && (
                        <Badge className="bg-primary/10 text-primary">{totalFavorites}</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                    </div>
                  </Link>
                  <Link href="/panier" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span className="text-gray-700 group-hover:text-primary">Mon panier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {totalItems > 0 && (
                        <Badge className="bg-primary/10 text-primary">{totalItems}</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                    </div>
                  </Link>
                </div>

                <Separator className="my-6" />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="informations" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="informations" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Informations
                </TabsTrigger>
                <TabsTrigger value="securite" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="activite" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Activité
                </TabsTrigger>
              </TabsList>

              {/* Informations Tab */}
              <TabsContent value="informations">
                <Card className="border-none shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>Modifiez vos informations personnelles</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isLoading}>
                          <X className="h-4 w-4 mr-2" />
                          Annuler
                        </Button>
                        <Button size="sm" onClick={handleSave} disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nom complet
                      </Label>
                      {isEditing ? (
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="Votre nom complet"
                          className="border-gray-200 focus:border-primary"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.full_name || "Non renseigné"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Adresse email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          className="border-gray-200 focus:border-primary"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Téléphone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+225 XX XX XX XX XX"
                          className="border-gray-200 focus:border-primary"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.phone || "Non renseigné"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Adresse de livraison
                      </Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Votre adresse complète"
                          className="border-gray-200 focus:border-primary"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{formData.address || "Non renseignée"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Membre depuis
                      </Label>
                      <p className="text-gray-900 py-2">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        }) : "Non disponible"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sécurité Tab */}
              <TabsContent value="securite">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Changer mon mot de passe</CardTitle>
                    <CardDescription>Modifiez votre mot de passe pour plus de sécurité</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Mot de passe actuel</Label>
                      <Input
                        id="current_password"
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-200 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">Nouveau mot de passe</Label>
                      <Input
                        id="new_password"
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-200 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="••••••••"
                        className="border-gray-200 focus:border-primary"
                      />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 mt-4">
                      Mettre à jour le mot de passe
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activité Tab */}
              <TabsContent value="activite">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Mon activité</CardTitle>
                    <CardDescription>Résumé de votre activité sur la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/5 rounded-lg p-4 text-center">
                        <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                        <p className="text-sm text-muted-foreground">Articles dans le panier</p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-4 text-center">
                        <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{totalFavorites}</p>
                        <p className="text-sm text-muted-foreground">Produits favoris</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Dernières commandes</h3>
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>Aucune commande récente</p>
                        <Link href="/produits" className="text-primary hover:underline mt-2 inline-block">
                          Découvrir nos produits
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}