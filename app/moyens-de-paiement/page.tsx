"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Smartphone, Globe, Building2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

interface Country {
  name: string
  iso_code: string
  status: boolean
}

interface Operator {
  name: string
  code: string
  active: boolean
  provider: string
  country: {
    name: string
    iso_code: string
  }
}

export default function PaymentMethodsPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [operators, setOperators] = useState<Operator[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [isLoadingOperators, setIsLoadingOperators] = useState(false)

  // Charger la liste des pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/mypvit/countries")
        const data = await response.json()
        if (data.success && data.data) {
          const activeCountries = data.data.filter((c: Country) => c.status === true)
          setCountries(activeCountries)
          if (activeCountries.length > 0) {
            setSelectedCountry(activeCountries[0].iso_code)
          }
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des pays",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCountries(false)
      }
    }
    fetchCountries()
  }, [])

  // Charger les opérateurs lorsque le pays change
  useEffect(() => {
    if (!selectedCountry) return
    const fetchOperators = async () => {
      setIsLoadingOperators(true)
      try {
        const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/mypvit/operators/${selectedCountry}`)
        const data = await response.json()
        if (data.success && data.data.operators) {
          const activeOps = data.data.operators.filter((op: Operator) => op.active === true)
          setOperators(activeOps)
        } else {
          setOperators([])
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les opérateurs",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOperators(false)
      }
    }
    fetchOperators()
  }, [selectedCountry])

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Moyens de Paiement</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les différentes méthodes de paiement disponibles pour vos achats sur Paradis Alimentaire
          </p>
        </div>


        {/* Nouvelle section : Opérateurs Mobile Money par pays */}
        <div className="mt-16">
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Smartphone className="h-6 w-6 text-primary" />
                Opérateurs Mobile Money disponibles
              </CardTitle>
              <CardDescription>
                Sélectionnez un pays pour voir les opérateurs Mobile Money actifs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Sélecteur de pays */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Pays
                    </Label>
                    {isLoadingCountries ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Chargement des pays...</span>
                      </div>
                    ) : (
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Choisissez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.iso_code} value={country.iso_code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {/* Liste des opérateurs */}
                {isLoadingOperators ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Chargement des opérateurs...</span>
                  </div>
                ) : operators.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {operators.map((operator) => (
                      <div
                        key={operator.code}
                        className="flex items-center gap-3 p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{operator.name}</p>
                          <p className="text-xs text-muted-foreground">{operator.provider}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-gray-50">
                    <Smartphone className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>Aucun opérateur actif pour ce pays.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Le reste de la page reste inchangé */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Comment ça marche ?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choisissez vos produits</h3>
              <p className="text-muted-foreground">
                Parcourez notre catalogue et ajoutez les produits que vous souhaitez acheter à votre panier.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Passez à la caisse</h3>
              <p className="text-muted-foreground">
                Vérifiez votre panier et procédez au paiement en choisissant votre méthode de paiement préférée.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recevez votre commande</h3>
              <p className="text-muted-foreground">
                Après confirmation de votre paiement, nous préparons et livrons votre commande à l'adresse indiquée.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quels sont les délais de paiement ?</h3>
                <p className="text-muted-foreground">
                  Les paiements par carte bancaire et Mobile Money sont traités immédiatement. Pour les virements
                  bancaires, le délai peut varier de 1 à 3 jours ouvrables.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Comment fonctionne le paiement à la livraison ?</h3>
                <p className="text-muted-foreground">
                  Lors de la livraison, notre livreur vous remettra votre commande et vous pourrez payer en espèces.
                  Assurez-vous d'avoir le montant exact pour faciliter la transaction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Les paiements sont-ils sécurisés ?</h3>
                <p className="text-muted-foreground">
                  Oui, tous les paiements effectués sur notre site sont sécurisés. Nous utilisons des protocoles de
                  cryptage avancés pour protéger vos informations personnelles et bancaires.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Puis-je changer de méthode de paiement après avoir passé ma commande ?
                </h3>
                <p className="text-muted-foreground">
                  Une fois la commande confirmée, il n'est généralement pas possible de changer de méthode de paiement.
                  Veuillez nous contacter rapidement si vous avez besoin de modifier votre méthode de paiement.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à commander ?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Découvrez notre sélection de produits frais et de qualité, et profitez de nos différentes méthodes de
              paiement pour une expérience d'achat flexible.
            </p>
            <Link href="/produits">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}