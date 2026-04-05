"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Banner from "@/components/banner"
import { toast } from "@/components/ui/use-toast"

export default function SuiviCommandePage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [orderFound, setOrderFound] = useState<boolean | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de commande",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch("https://ecomerce-api-aotc.onrender.com/api/tracking/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          email: email.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrderFound(true)
        // Transformer les données pour le format attendu
        setOrderDetails({
          number: data.data.number,
          date: new Date(data.data.date).toLocaleDateString("fr-FR"),
          status: data.data.status,
          statusCode: data.data.statusCode,
          items: data.data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping: {
            method: data.data.shipping.method,
            address: data.data.shipping.address,
            estimatedDelivery: data.data.shipping.estimatedDelivery
              ? new Date(data.data.shipping.estimatedDelivery).toLocaleDateString("fr-FR")
              : "Non disponible",
            trackingEvents: data.data.shipping.trackingEvents.map((event: any) => ({
              date: new Date(event.date).toLocaleString("fr-FR"),
              status: event.status,
              icon: getStatusIconComponent(event.statusCode),
            })),
          },
          payment: {
            method: data.data.payment.method,
            subtotal: data.data.payment.subtotal,
            shipping: data.data.payment.shipping,
            total: data.data.payment.total,
          },
        })
      } else {
        setOrderFound(false)
        setOrderDetails(null)
        toast({
          title: "Commande non trouvée",
          description: data.message || "Aucune commande ne correspond à ces informations",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      setOrderFound(false)
      setOrderDetails(null)
      toast({
        title: "Erreur",
        description: "Impossible de rechercher la commande. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case "confirmed":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-700"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIconComponent = (statusCode: string) => {
    switch (statusCode) {
      case "confirmed":
        return CheckCircle
      case "processing":
        return Package
      case "shipped":
        return Truck
      case "delivered":
        return CheckCircle
      case "cancelled":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getStatusIcon = (statusCode: string) => {
    const Icon = getStatusIconComponent(statusCode)
    return <Icon className="h-5 w-5" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
  }

  const handleDownloadInvoice = async () => {
    if (!orderDetails) return

    try {
      // Récupérer l'ID de la commande via le numéro
      const response = await fetch(`https://ecomerce-api-aotc.onrender.com//api/orders/${orderDetails.number}`)
      const data = await response.json()

      if (data.success && data.data.id) {
        // Télécharger la facture
        const invoiceResponse = await fetch(`https://ecomerce-api-aotc.onrender.com//api/orders/${data.data.id}/invoice`)
        const invoiceData = await invoiceResponse.json()

        if (invoiceData.success) {
          // Créer un fichier JSON à télécharger
          const blob = new Blob([JSON.stringify(invoiceData.data, null, 2)], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `facture_${orderDetails.number}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Facture téléchargée",
            description: "La facture a été téléchargée avec succès.",
          })
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture",
        variant: "destructive",
      })
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
                      Numéro de commande *
                    </label>
                    <Input
                      id="orderNumber"
                      placeholder="Ex: CMD-1709568000000-123"
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommandé si vous avez plusieurs commandes avec le même numéro.
                    </p>
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
                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Sous-total</span>
                        <span>{formatCurrency(orderDetails.payment.subtotal)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Frais de livraison</span>
                        <span>{formatCurrency(orderDetails.payment.shipping)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg mt-2">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(orderDetails.payment.total)}</span>
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
                      {orderDetails.shipping.trackingEvents.map((event: any, index: number) => {
                        const Icon = getStatusIconComponent(event.statusCode || event.status)
                        return (
                          <div key={index} className="flex mb-6 last:mb-0">
                            <div className="mr-4 relative">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
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
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" asChild>
                    <a href="/contact">Besoin d'aide ?</a>
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleDownloadInvoice}>
                    Télécharger la facture
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}