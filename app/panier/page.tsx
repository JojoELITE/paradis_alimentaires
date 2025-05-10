"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const shipping = 2500 // 2500 FCFA for shipping
  const total = subtotal + shipping

  const handleApplyCoupon = () => {
    if (!couponCode) return

    setIsApplyingCoupon(true)

    // Simulate API call
    setTimeout(() => {
      setIsApplyingCoupon(false)
      // Here you would normally apply the discount
      setCouponCode("")
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-32 w-32">
              <ShoppingBag className="h-full w-full text-gray-300" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Vous n'avez pas encore ajouté de produits à votre panier. Parcourez notre catalogue pour trouver des
            produits frais et de qualité.
          </p>
          <Link href="/produits">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Articles ({items.length})</h2>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vider le panier
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right">
                          <div className="text-lg font-semibold">{item.price.toLocaleString()} FCFA</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} × {item.price.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none text-gray-500"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none text-gray-500"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Link href="/produits">
                  <Button variant="outline" className="w-full">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Passer à la caisse
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span className="font-medium">{shipping.toLocaleString()} FCFA</span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()} FCFA</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Taxes incluses si applicables</p>
                </div>

                <div className="pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Code promo"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode}
                      className={cn("bg-navy-blue hover:bg-navy-blue/90", isApplyingCoupon && "opacity-70")}
                    >
                      {isApplyingCoupon ? "..." : "Appliquer"}
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90 py-6">
                      Passer à la caisse
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="pt-4">
                  <div className="text-sm text-center text-muted-foreground">Nous acceptons:</div>
                  <div className="flex justify-center space-x-2 mt-2">
                    <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                      Visa
                    </div>
                    <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                      MC
                    </div>
                    <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                      PayPal
                    </div>
                    <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-xs font-medium">
                      Orange
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium mb-4">Besoin d'aide?</h3>
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
