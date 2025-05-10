"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard, Truck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

const paymentMethods = [
  { id: "card", name: "Carte bancaire", description: "Visa, Mastercard, etc." },
  { id: "mobile", name: "Mobile Money", description: "Orange Money, MTN Mobile Money, etc." },
  { id: "cash", name: "Paiement à la livraison", description: "Payez en espèces à la réception" },
]

const deliveryMethods = [
  { id: "standard", name: "Standard", price: 2500, description: "Livraison en 3-5 jours ouvrables" },
  { id: "express", name: "Express", price: 5000, description: "Livraison en 1-2 jours ouvrables" },
]

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id)
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0].id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const selectedDelivery = deliveryMethods.find((d) => d.id === deliveryMethod) || deliveryMethods[0]
  const total = subtotal + selectedDelivery.price

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsComplete(true)
      clearCart()
    }, 2000)
  }

  if (isComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container max-w-md mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Commande confirmée!</h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre commande.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-sm text-muted-foreground mb-2">Numéro de commande</div>
            <div className="text-lg font-medium">#PA{Math.floor(100000 + Math.random() * 900000)}</div>
          </div>
          <Link href="/">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <Link href="/panier" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au panier
        </Link>

        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 flex items-center">
                  <h2 className="text-xl font-semibold">Informations de livraison</h2>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" required className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" type="tel" required className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" required className="mt-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" required className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="region">Région / Quartier</Label>
                      <Input id="region" required className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Instructions de livraison (optionnel)</Label>
                    <Textarea id="notes" className="mt-1" placeholder="Instructions spéciales pour la livraison..." />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Méthode de livraison</h2>
                </div>

                <div className="p-6">
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="space-y-4">
                      {deliveryMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors",
                            deliveryMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50",
                          )}
                          onClick={() => setDeliveryMethod(method.id)}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={method.id} id={`delivery-${method.id}`} className="mt-1" />
                            <div>
                              <Label htmlFor={`delivery-${method.id}`} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div className="font-medium">{method.price.toLocaleString()} FCFA</div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Méthode de paiement</h2>
                </div>

                <div className="p-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            "flex items-center border rounded-lg p-4 cursor-pointer transition-colors",
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-primary/50",
                          )}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mr-3" />
                          <div>
                            <Label htmlFor={`payment-${method.id}`} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Numéro de carte</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Date d'expiration</Label>
                          <Input id="expiryDate" placeholder="MM/AA" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" className="mt-1" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardName">Nom sur la carte</Label>
                        <Input id="cardName" className="mt-1" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "mobile" && (
                    <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
                        <Input id="mobileNumber" placeholder="Ex: 07X XXX XXX" className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="mobileProvider">Fournisseur</Label>
                        <select
                          id="mobileProvider"
                          className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="orange">Orange Money</option>
                          <option value="mtn">MTN Mobile Money</option>
                          <option value="moov">Moov Money</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Traitement en cours..." : `Payer ${total.toLocaleString()} FCFA`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-32">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
              </div>

              <div className="p-6">
                <div className="max-h-80 overflow-y-auto space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {item.price.toLocaleString()} FCFA
                        </p>
                      </div>

                      <div className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()} FCFA</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison ({selectedDelivery.name})</span>
                    <span className="font-medium">{selectedDelivery.price.toLocaleString()} FCFA</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{total.toLocaleString()} FCFA</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Taxes incluses si applicables</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
