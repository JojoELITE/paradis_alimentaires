"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const API_BASE = "https://ecomerce-api-1-dp0w.onrender.com/api"

// ─── Types ────────────────────────────────────────────────────────────────────
interface CouponData {
  id: string
  code: string
  type: "percentage" | "fixed"
  discount: number
  description: string | null
  remaining_uses: number | null
  valid_until: string | null
}

interface AppliedCoupon {
  coupon: CouponData
  pricing: {
    original_amount: number
    discount_amount: number
    final_amount: number
    savings_percentage: number
    discount_label: string
  }
}

const getImageUrl = (item: any) => {
  const url = item?.image || item?.imageUrl || item?.image_url || item?.product?.image || item?.product?.imageUrl
  if (url && url.startsWith('http')) return url
  return "/placeholder.png"
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart, setItems } = useCart()
  const { user } = useAuth()

  // États
  const [isLoading, setIsLoading] = useState(true)
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "no_delivery">("delivery")
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null)

  // État pour suivre quel produit est en cours de mise à jour
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const baseShipping = 2500
  const shipping = deliveryMethod === "no_delivery" ? 0 : baseShipping
  const discountAmount = appliedCoupon?.pricing.discount_amount ?? 0
  const total = subtotal + shipping - discountAmount

  // ─── Chargement du panier depuis l'API ────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE}/cart/${user.id}`)
        const data = await response.json()

        if (data.success && data.data) {
          const cartItems = data.data.items.map((item: any) => ({
            id: item.id, // ✅ FIX PRINCIPAL
            productId: item.product_id, // ✅ AJOUT
            name: item.product?.name || "Produit",
            price:
              typeof item.product?.price === "string"
                ? parseFloat(item.product.price)
                : item.product?.price || 0,
            quantity: item.quantity,
            image:
              item.product?.imageUrl ||
              item.product?.image_url ||
              "/placeholder.png",
            category: item.product?.category || "Produit",
          }))

          setItems(cartItems)
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCart()
  }, [user, setItems])

  // ─── Synchronisation avec l'API ──────────────────────────────────────────────
  // ─── Synchronisation avec l'API ──────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || items.length === 0) return

    const timeoutId = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/cart/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            items: items.map((item) => ({
              product_id: item.productId,
              quantity: item.quantity,
            })),
          }),
        })
      } catch (error) {
        console.error("Erreur lors de la synchronisation:", error)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [items, user])

  // ─── Gestion de la quantité (CORRECTION ICI) ─────────────────────────────────
  const handleIncrement = (id: string, currentQuantity: number) => {
    setUpdatingId(id)
    updateQuantity(id, currentQuantity + 1)
    setTimeout(() => setUpdatingId(null), 300)
  }

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity <= 1) return
    setUpdatingId(id)
    updateQuantity(id, currentQuantity - 1)
    setTimeout(() => setUpdatingId(null), 300)
  }

  const handleRemove = (id: string) => {
    setUpdatingId(id)
    removeItem(id)
    setTimeout(() => setUpdatingId(null), 300)
  }

  // ─── Appliquer un coupon ─────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    setCouponError(null)
    setCouponSuccess(null)

    try {
      const response = await fetch(`${API_BASE}/coupons/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          userId: user?.id ?? null,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        const discountAmountValue = data.data.discount_amount ?? 0

        setAppliedCoupon({
          coupon: {
            id: data.data.coupon?.id ?? "",
            code: couponCode,
            type: data.data.coupon?.type ?? "fixed",
            discount: data.data.coupon?.discount ?? 0,
            description: data.data.coupon?.description ?? null,
            remaining_uses: data.data.remaining_uses ?? null,
            valid_until: null,
          },
          pricing: {
            original_amount: subtotal,
            discount_amount: discountAmountValue,
            final_amount: subtotal + shipping - discountAmountValue,
            savings_percentage: subtotal > 0 ? Math.round((discountAmountValue / subtotal) * 100) : 0,
            discount_label: `-${discountAmountValue} FCFA`,
          },
        })

        setCouponSuccess(`Coupon appliqué — vous économisez ${discountAmountValue} FCFA 🎉`)
        setCouponCode("")
      } else {
        setCouponError(data.message || "Coupon invalide")
        setAppliedCoupon(null)
      }
    } catch (error) {
      console.error(error)
      setCouponError("Erreur réseau")
      setAppliedCoupon(null)
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponSuccess(null)
    setCouponError(null)
  }

  const handleCouponKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleApplyCoupon()
  }

  // ─── Affichages ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Chargement de votre panier...</p>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <ShoppingBag className="h-32 w-32 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Vous n&apos;avez pas encore ajouté de produits à votre panier.
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

  // ─── RENDU PRINCIPAL ─────────────────────────────────────────────────────────
  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
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

              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const imageUrl = getImageUrl(item)
                  const isUpdating = updatingId === item.id

                  return (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      {/* Infos produit */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <div className="text-lg font-semibold">
                              {(item.price * item.quantity).toLocaleString()} FCFA
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} × {item.price.toLocaleString()} FCFA
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none text-gray-500 disabled:opacity-50"
                              onClick={() => handleDecrement(item.id, item.quantity)}
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                            </Button>

                            <span className="w-10 text-center">{item.quantity}</span>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none text-gray-500 disabled:opacity-50"
                              onClick={() => handleIncrement(item.id, item.quantity)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                            onClick={() => handleRemove(item.id)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/produits" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continuer mes achats
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Passer à la caisse
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Récapitulatif</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryMethod === "delivery"}
                      onChange={() => setDeliveryMethod("delivery")}
                    />
                    Avec livraison (+{baseShipping.toLocaleString()} FCFA)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryMethod === "no_delivery"}
                      onChange={() => setDeliveryMethod("no_delivery")}
                    />
                    Retrait en magasin (gratuit)
                  </label>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frais de livraison</span>
                  <span className="font-medium">{shipping.toLocaleString()} FCFA</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Réduction ({appliedCoupon.coupon.code})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        -{appliedCoupon.pricing.discount_amount.toLocaleString()} FCFA
                      </span>
                      <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{total.toLocaleString()} FCFA</span>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-green-600 mt-1">
                      🎉 Économie de {appliedCoupon.pricing.discount_amount.toLocaleString()} FCFA
                    </p>
                  )}
                </div>

                {/* Zone coupon */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-700">{appliedCoupon.coupon.code}</p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-green-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Code promo"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onKeyDown={handleCouponKeyDown}
                        disabled={isApplyingCoupon}
                      />
                      <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode.trim()}>
                        {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Appliquer"}
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-xs text-green-600 mt-1">{couponSuccess}</p>}
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 py-6">
                    Passer à la caisse
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
