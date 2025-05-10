"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Banner from "@/components/banner"

export default function SuiviCommandePage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [orderFound, setOrderFound] = useState<boolean | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)

    // Simuler une recherche
    setTimeout(() => {
      setIsSearching(false)

      // Simuler un résultat de commande (pour démonstration)
      if (orderNumber === "123456" || orderNumber === "PA123456") {
        setOrderFound(true)
        setOrderDetails({
          number: "PA123456",
          date: "10/05/2023",
          status: "En cours de livraison",
          statusCode: "shipping",
          items: [
            { id: 1, name: "Panier de fruits frais", quantity: 1, price: 24990 },
            { id: 2, name: "Little Star - Jus d'Orange", quantity: 2, price: 1500 },
            { id: 3, name: "Biscuits artisanaux", quantity: 1, price: 14990 },
          ],
          shipping: {
            method: "Livraison standard",
            address: "123 Avenue des Champs-Élysées, 75008 Paris, France",
            estimatedDelivery: "12/05/2023",
            trackingEvents: [
              { date: "10/05/2023 - 10:30", status: "Commande confirmée", icon: CheckCircle },
              { date: "10/05/2023 - 14:45", status: "En cours de préparation", icon: Package },
              { date: "11/05/2023 - 09:15", status: "Expédiée", icon: Truck },
              { date: "12/05/2023 - 18:00", status: "Livraison prévue", icon: Clock },
            ],
          },
          payment: {
            method: "Carte bancaire",
            subtotal: 42980,
            shipping: 2500,
            total: 45480,
          },
        })
      } else {
        setOrderFound(false)
        setOrderDetails(null)
      }
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "shipping":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-700"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (statusCode: string) => {
    switch (statusCode) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipping":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <Banner
            title="Suivez votre commande"
            description="Consultez l'état de votre commande et suivez son acheminement jusqu'à votre domicile."
            buttonText="Contactez-nous"
            buttonLink="/contact"
            image="/images/hero2.jpeg"
            bgColor="bg-navy-blue"
            position="left"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de recherche */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Rechercher ma commande</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium mb-1">
                      Numéro de commande
                    </label>
                    <Input
                      id="orderNumber"
                      placeholder="Ex: PA123456"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Vous trouverez ce numéro dans l'email de confirmation de commande.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email (optionnel)
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSearching}>
                    {isSearching ? (
                      <span className="flex items-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Recherche en cours...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Search className="h-4 w-4 mr-2" />
                        Rechercher
                      </span>
                    )}
                  </Button>
                </form>

                <div className="mt-6 bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium text-sm mb-2">Besoin d'aide ?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Si vous ne trouvez pas votre commande ou si vous avez des questions, n'hésitez pas à contacter notre
                    service client.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/contact">Contacter le service client</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résultats de la recherche */}
          <div className="lg:col-span-2">
            {orderFound === null && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex flex-col items-center justify-center">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Suivez votre commande</h2>
                <p className="text-muted-foreground max-w-md">
                  Entrez votre numéro de commande pour suivre son statut et connaître sa date de livraison estimée.
                </p>
              </div>
            )}

            {orderFound === false && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Commande introuvable</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Nous n'avons pas trouvé de commande correspondant au numéro "{orderNumber}". Veuillez vérifier le
                  numéro et réessayer.
                </p>
                <div className="space-y-4">
                  <p className="text-sm font-medium">Suggestions :</p>
                  <ul className="text-sm text-muted-foreground text-left list-disc pl-5 space-y-1">
                    <li>Vérifiez que vous avez saisi le bon numéro de commande</li>
                    <li>Consultez vos emails pour retrouver votre numéro de commande</li>
                    <li>Si vous venez de passer commande, attendez quelques minutes</li>
                    <li>Contactez notre service client si le problème persiste</li>
                  </ul>
                </div>
              </div>
            )}

            {orderFound === true && orderDetails && (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Commande #{orderDetails.number}</CardTitle>
                    <Badge className={getStatusColor(orderDetails.statusCode)}>{orderDetails.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Date de commande</h3>
                        <p className="text-muted-foreground">{orderDetails.date}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Livraison estimée</h3>
                        <p className="text-muted-foreground">{orderDetails.shipping.estimatedDelivery}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Adresse de livraison</h3>
                      <p className="text-muted-foreground">{orderDetails.shipping.address}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Articles commandés</h3>
                      <div className="space-y-3">
                        {orderDetails.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{((item.price * item.quantity) / 100).toLocaleString()} FCFA</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span>{(orderDetails.payment.subtotal / 100).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Frais de livraison</span>
                        <span>{(orderDetails.payment.shipping / 100).toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg mt-2">
                        <span>Total</span>
                        <span className="text-primary">{(orderDetails.payment.total / 100).toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Suivi de livraison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {orderDetails.shipping.trackingEvents.map((event: any, index: number) => (
                        <div key={index} className="flex mb-6 last:mb-0">
                          <div className="mr-4 relative">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <event.icon className="h-5 w-5 text-primary" />
                            </div>
                            {index < orderDetails.shipping.trackingEvents.length - 1 && (
                              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <a href="/contact">Besoin d'aide ?</a>
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">Télécharger la facture</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
