"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard, Truck, Check, MapPin, Phone, Mail, User, MessageCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// --- Modes de paiement ---
const paymentMethods = [
  { id: "card", name: "Carte bancaire", description: "Visa, Mastercard, etc." },
  { id: "mobile", name: "Mobile Money", description: "Orange Money, MTN Mobile Money, etc." },
  { id: "cash", name: "Paiement à la livraison", description: "Payez en espèces à la réception" },
]

// --- Modes de livraison ---
const deliveryMethods = [
  { id: "standard", name: "Standard", price: 2500, description: "Livraison en 3-5 jours ouvrables" },
  { id: "express", name: "Express", price: 5000, description: "Livraison en 1-2 jours ouvrables" },
]

// --- Sous-composants ---
function CardInputs() {
  return (
    <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
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
        <Input id="cardName" placeholder="Nom sur la carte" className="mt-1" />
      </div>
    </div>
  )
}

function MobileInputs() {
  return (
    <div className="mt-6 space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div>
        <Label htmlFor="mobileNumber">Numéro de téléphone Mobile Money</Label>
        <Input id="mobileNumber" placeholder="Ex: 07X XXX XXX" className="mt-1" />
        <p className="text-xs text-muted-foreground mt-1">
          Vous recevrez une demande de paiement sur votre téléphone
        </p>
      </div>
      <div>
        <Label htmlFor="mobileProvider">Opérateur</Label>
        <select id="mobileProvider" className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2">
          <option value="orange">Orange Money</option>
          <option value="mtn">MTN Mobile Money</option>
          <option value="moov">Moov Money</option>
        </select>
      </div>
    </div>
  )
}

// --- Composant principal ---
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id)
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0].id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  // Informations de livraison
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",       // utilisé comme customerAccountNumber pour le KYC
    address: "",
    city: "",
    notes: "",
  })

  const selectedDelivery = deliveryMethods.find((d) => d.id === deliveryMethod) || deliveryMethods[0]
  const total = subtotal + selectedDelivery.price

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // --- Validation basique ---
    if (!shippingInfo.fullName.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre nom complet", variant: "destructive" })
      return
    }
    if (!shippingInfo.email.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre email", variant: "destructive" })
      return
    }
    if (!shippingInfo.phone.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre numéro de téléphone", variant: "destructive" })
      return
    }
    if (!shippingInfo.address.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre adresse de livraison", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      // --- Récupération de l'userId depuis le localStorage ---
      let userId: string | null = null
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          userId = userData.id
        }
      } catch (e) {
        console.error("Erreur parsing user:", e)
      }

      // Génère un ID temporaire pour les invités
     
      // --- Appel API ---
      // FIX 1 : "hhttp://" corrigé en "http://"
      // FIX 2 : customerAccountNumber envoyé (requis par le backend pour le KYC)
      // FIX 3 : customerName et customerEmail conservés en bonus (ignorés côté backend mais utiles si tu l'adaptes)
      const response = await fetch("http://localhost:3333/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Identification utilisateur
          userId: userId,

          // ✅ FIX : champ attendu par le backend pour le KYC
          customerAccountNumber: shippingInfo.phone,

          // Adresses
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}`,
          billingAddress: `${shippingInfo.address}, ${shippingInfo.city}`,

          // Livraison
          deliveryMethod: deliveryMethod,
          deliveryPrice: selectedDelivery.price,

          // Notes
          notes: shippingInfo.notes || null,

          // Infos supplémentaires (pour log / extension future)
          customerName: shippingInfo.fullName,
          customerEmail: shippingInfo.email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrderNumber(data.data.orderNumber)
        setIsComplete(true)
        clearCart()

        toast({
          title: "Commande confirmée !",
          description: `Votre commande #${data.data.orderNumber} a été créée avec succès.`,
        })
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue lors de la création de la commande",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // --- Page commande réussie ---
  if (isComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container max-w-md mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Commande confirmée !
          </h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de votre livraison.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="text-sm text-muted-foreground mb-2">Numéro de commande</div>
            <div className="text-xl font-bold text-primary font-mono">{orderNumber}</div>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                Retour à l'accueil
              </Button>
            </Link>
            <Link href="/commandes">
              <Button variant="outline" size="lg" className="w-full">
                Voir mes commandes
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // --- Page checkout ---
  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <Link
          href="/panier"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour au panier
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Finaliser la commande
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations de livraison */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Informations de livraison</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Nom complet *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        placeholder="jean@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      Téléphone / Numéro Mobile Money *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="+225 07 XX XX XX XX"
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Ce numéro sera utilisé pour la livraison et le paiement Mobile Money
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse de livraison *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      placeholder="Rue des Jardins, Cocody"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      placeholder="Abidjan"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Notes (optionnel)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={shippingInfo.notes}
                      onChange={handleInputChange}
                      placeholder="Instructions de livraison, point de repère, etc."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Mode de livraison</h2>
                </div>
                <div className="p-6">
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="space-y-4">
                      {deliveryMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-all",
                            deliveryMethod === method.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
                          )}
                          onClick={() => setDeliveryMethod(method.id)}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={method.id} id={`delivery-${method.id}`} />
                            <div>
                              <Label htmlFor={`delivery-${method.id}`} className="font-medium cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            {method.price.toLocaleString()} FCFA
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                            "flex items-center border rounded-lg p-4 cursor-pointer transition-all",
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
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

                  {paymentMethod === "card" && <CardInputs />}
                  {paymentMethod === "mobile" && <MobileInputs />}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  `Payer ${total.toLocaleString()} FCFA`
                )}
              </Button>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
                <p className="text-sm text-muted-foreground mt-1">{items.length} article(s)</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison ({selectedDelivery.name})</span>
                    <span>{selectedDelivery.price.toLocaleString()} FCFA</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-3 text-center text-sm">
                  <p className="text-primary font-medium">Livraison sécurisée</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Votre commande sera livrée dans les meilleurs délais
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium mb-4">Besoin d'aide ?</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-primary hover:underline">
                    Contactez-nous
                  </Link>
                </li>
                <li>
                  <Link href="/livraison" className="text-primary hover:underline">
                    Politique de livraison
                  </Link>
                </li>
                <li>
                  <Link href="/retours" className="text-primary hover:underline">
                    Politique de retours
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}