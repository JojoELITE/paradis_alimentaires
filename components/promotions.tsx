"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Tag, Copy, Check, Clock, Percent, Banknote, RefreshCw } from "lucide-react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  description: string | null
  valid_until: string | null
  minimum_order_amount: number | null
  maximum_discount_amount: number | null
  status: "active" | "expired" | "disabled"
}

// ─────────────────────────────────────────────
// Hook — récupère TOUT sans filtre
// ─────────────────────────────────────────────
function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoupons = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/merchant/coupons", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`)

      const json = await res.json()
      console.log(json)
      // Gérer tous les formats possibles retournés par AdonisJS
      if (json.success && Array.isArray(json.data)) {
        setCoupons(json.data)
      } else if (json.success && Array.isArray(json.data?.data)) {
        setCoupons(json.data.data)
      } else if (Array.isArray(json.data)) {
        setCoupons(json.data)
      } else if (Array.isArray(json)) {
        setCoupons(json)
      } else {
        setCoupons([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCoupons() }, [])

  return { coupons, loading, error, refetch: fetchCoupons }
}

// ─────────────────────────────────────────────
// CouponCard
// ─────────────────────────────────────────────
function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDiscount = () =>
    coupon.type === "percentage" ? `-${coupon.discount}%` : `-${coupon.discount} FCFA`

  const formatExpiry = () => {
    if (!coupon.valid_until) return null
    return new Date(coupon.valid_until).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    })
  }

  const accentColor =
    coupon.status === "active" ? "bg-primary" :
      coupon.status === "expired" ? "bg-red-400" : "bg-gray-300"

  const statusLabel = { active: "Actif", expired: "Expiré", disabled: "Désactivé" }[coupon.status]
  const statusClass =
    coupon.status === "active" ? "bg-green-500/10 text-green-600 border-green-200" :
      coupon.status === "expired" ? "bg-red-500/10 text-red-500 border-red-200" :
        "bg-gray-100 text-gray-400 border-gray-200"

  return (
    <div className="relative flex items-stretch bg-white border border-dashed border-primary/30 rounded-xl overflow-hidden hover:shadow-md hover:border-primary/60 transition-all duration-200">
      {/* Bande gauche */}
      <div className={`w-2 shrink-0 ${accentColor}`} />

      {/* Encoche */}
      <div className="absolute left-[6px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-muted border border-border z-10" />

      {/* Réduction */}
      <div className="flex items-center justify-center w-20 shrink-0 bg-primary/5 border-r border-dashed border-primary/30">
        <div className="text-center px-1">
          <p className="text-primary font-black text-lg leading-none">{formatDiscount()}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
            {coupon.type === "percentage" ? "remise" : "fixe"}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 px-4 py-3 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {coupon.type === "percentage"
              ? <Percent className="w-3 h-3 text-primary shrink-0" />
              : <Banknote className="w-3 h-3 text-primary shrink-0" />}
            <p className="text-xs text-muted-foreground truncate">
              {coupon.description ?? "Coupon de réduction"}
            </p>
          </div>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium shrink-0 ${statusClass}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <code className="text-sm font-bold tracking-widest text-foreground bg-muted px-2 py-0.5 rounded">
            {coupon.code}
          </code>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors" title="Copier">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {coupon.minimum_order_amount && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              Min. {coupon.minimum_order_amount} FCFA
            </span>
          )}
          {formatExpiry() && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              Expire le {formatExpiry()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
function CouponSkeleton() {
  return (
    <div className="flex items-stretch bg-white border border-dashed border-muted rounded-xl overflow-hidden animate-pulse h-[90px]">
      <div className="w-2 bg-muted shrink-0" />
      <div className="w-20 bg-muted/50 border-r border-dashed border-muted shrink-0" />
      <div className="flex-1 px-4 py-3 space-y-2">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-1/3" />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function Promotions() {
  const { coupons, loading, error, refetch } = useCoupons()

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Offres Spéciales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profitez de nos promotions exclusives et économisez sur vos produits préférés
          </p>
        </div>

        {/* Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent z-10" />
            <Image src="/images/juice.png" alt="Promotion jus de fruits" width={600} height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
              <div className="max-w-xs">
                <h3 className="text-white text-2xl font-bold mb-2">Jus de fruits frais</h3>
                <p className="text-white/90 mb-4">Jusqu'à 30% de réduction sur une sélection de jus frais</p>
                <Link href="/promotions/fruits">
                  <Button className="bg-white text-primary hover:bg-white/90">En profiter</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-transparent z-10" />
            <Image src="/images/tomato.png" alt="Promotion produits bio" width={600} height={400}
              className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
              <div className="max-w-xs">
                <h3 className="text-white text-2xl font-bold mb-2">Produits bio</h3>
                <p className="text-white/90 mb-4">Découvrez notre nouvelle gamme de produits biologiques</p>
                <Link href="/promotions/bio">
                  <Button className="bg-white text-green-600 hover:bg-white/90">Découvrir</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Grande bannière */}
        <div className="mt-8 relative overflow-hidden rounded-xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent z-10" />
          <Image src="/images/biscuit.png" alt="Promotion livraison gratuite" width={1200} height={400}
            className="w-full h-[250px] object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
            <div className="max-w-lg">
              <h3 className="text-white text-3xl font-bold mb-2">Livraison gratuite</h3>
              <p className="text-white/90 mb-4">
                Pour toute commande supérieure à 50 000 FCFA — Offre valable jusqu'au 31 mai
              </p>
              <Link href="/promotions/livraison">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Commander maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Coupons ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Codes promo disponibles</h3>
              {!loading && coupons.length > 0 && (
                <Badge variant="secondary">
                  {coupons.length} coupon{coupons.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            {error && (
              <Button variant="outline" size="sm" onClick={refetch} className="gap-2">
                <RefreshCw className="w-4 h-4" />Réessayer
              </Button>
            )}
          </div>

          {error ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-red-200">
              <Tag className="w-8 h-8 mx-auto mb-3 text-red-300" />
              <p className="text-sm font-medium text-red-500 mb-1">Impossible de charger les coupons</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading && Array.from({ length: 6 }).map((_, i) => <CouponSkeleton key={i} />)}
              {!loading && coupons.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground bg-white rounded-xl border border-dashed">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun coupon disponible pour le moment</p>
                </div>
              )}
              {!loading && coupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}            