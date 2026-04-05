"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Tag, Copy, Check, Clock, Percent, Banknote, RefreshCw, TrendingDown, Gift } from "lucide-react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Coupon {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  description: string | null
  valid_from: string | null
  valid_until: string | null
  usage_limit: number | null
  used_count: number | null
  minimum_order_amount: number | null
  maximum_discount_amount: number | null
  status: "active" | "expired" | "disabled"
}

interface Promotion {
  id: string
  title: string
  description: string | null
  image_url: string | null
  banner_image: string | null
  type: "banner" | "flash_sale" | "category_offer"
  discount_percentage: number | null
  discount_amount: number | null
  category: string | null
  link: string | null
  button_text: string
  min_order_amount: number | null
  start_date: string | null
  end_date: string | null
  status: "active" | "expired" | "upcoming" | "disabled"
  priority: number
}

// ─────────────────────────────────────────────
// Hook — récupère les coupons
// ─────────────────────────────────────────────
function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoupons = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("https://ecomerce-api-aotc.onrender.com/api/coupons", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`)

      const json = await res.json()
      console.log(json)
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
// Hook — récupère les promotions (bannières)
// ─────────────────────────────────────────────
function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("https://ecomerce-api-aotc.onrender.com/api/promotions?status=active", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!res.ok) throw new Error(`Erreur ${res.status} : ${res.statusText}`)

      const json = await res.json()
      console.log("Promotions:", json)

      if (json.success && Array.isArray(json.data)) {
        setPromotions(json.data)
      } else if (Array.isArray(json)) {
        setPromotions(json)
      } else {
        setPromotions([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
      setPromotions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPromotions() }, [])

  return { promotions, loading, error, refetch: fetchPromotions }
}

// ─────────────────────────────────────────────
// CouponCard avec effet de dégradé progressif
// ─────────────────────────────────────────────
function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const usagePercentage = coupon.usage_limit && coupon.used_count !== null
    ? (coupon.used_count / coupon.usage_limit) * 100
    : 0

  const getOpacityAndColor = () => {
    if (usagePercentage >= 100) return { opacity: 0, color: "bg-gray-100", border: "border-gray-100", text: "text-gray-300" }
    if (usagePercentage >= 80) return { opacity: 0.3, color: "bg-orange-100", border: "border-orange-200", text: "text-orange-300" }
    if (usagePercentage >= 60) return { opacity: 0.5, color: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-400" }
    if (usagePercentage >= 40) return { opacity: 0.7, color: "bg-green-100", border: "border-green-200", text: "text-green-500" }
    if (usagePercentage >= 20) return { opacity: 0.9, color: "bg-primary/10", border: "border-primary/30", text: "text-primary" }
    return { opacity: 1, color: "bg-primary/5", border: "border-primary/30", text: "text-primary" }
  }

  const { opacity, color, border, text } = getOpacityAndColor()

  const formatDiscount = () =>
    coupon.type === "percentage" ? `-${coupon.discount}%` : `-${coupon.discount} FCFA`

  const formatExpiry = () => {
    if (!coupon.valid_until) return null
    return new Date(coupon.valid_until).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric",
    })
  }

  const statusLabel = { active: "Actif", expired: "Expiré", disabled: "Désactivé" }[coupon.status]
  const statusClass =
    coupon.status === "active" ? "bg-green-500/10 text-green-600 border-green-200" :
      coupon.status === "expired" ? "bg-red-500/10 text-red-500 border-red-200" :
        "bg-gray-100 text-gray-400 border-gray-200"

  if (usagePercentage >= 100 && coupon.status === "active") {
    return null
  }

  return (
    <div
      className={`relative flex items-stretch ${color} border border-dashed ${border} rounded-xl overflow-hidden hover:shadow-md transition-all duration-500`}
      style={{
        opacity: opacity,
        filter: `grayscale(${usagePercentage > 80 ? 0.5 : 0})`,
        transition: "all 0.5s ease-in-out"
      }}
    >
      <div
        className={`w-2 shrink-0 transition-all duration-500`}
        style={{
          background: `linear-gradient(135deg, 
            ${usagePercentage >= 80 ? '#ef4444' :
              usagePercentage >= 60 ? '#f59e0b' :
                usagePercentage >= 40 ? '#10b981' :
                  usagePercentage >= 20 ? '#3b82f6' : '#8b5cf6'}, 
            ${usagePercentage >= 80 ? '#dc2626' :
              usagePercentage >= 60 ? '#d97706' :
                usagePercentage >= 40 ? '#059669' :
                  usagePercentage >= 20 ? '#2563eb' : '#7c3aed'})`
        }}
      />

      <div className="absolute left-[6px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-muted border border-border z-10" />

      <div className={`flex items-center justify-center w-20 shrink-0 ${color} border-r border-dashed ${border}`}>
        <div className="text-center px-1">
          <p className={`font-black text-lg leading-none ${text}`}>{formatDiscount()}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
            {coupon.type === "percentage" ? "remise" : "fixe"}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 min-w-0">
        <div className="flex items-center justify-between mb-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {coupon.type === "percentage"
              ? <Percent className={`w-3 h-3 ${text} shrink-0`} />
              : <Banknote className={`w-3 h-3 ${text} shrink-0`} />}
            <p className="text-xs text-muted-foreground truncate">
              {coupon.description ?? "Coupon de réduction"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {usagePercentage > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${usagePercentage >= 80 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {Math.round(usagePercentage)}% utilisé
              </span>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium shrink-0 ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <code className={`text-sm font-bold tracking-widest ${text} bg-muted/50 px-2 py-0.5 rounded`}>
            {coupon.code}
          </code>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors" title="Copier">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {coupon.minimum_order_amount && (
            <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
              Min. {coupon.minimum_order_amount} FCFA
            </span>
          )}
          {coupon.usage_limit && coupon.used_count !== null && (
            <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <TrendingDown className="w-2.5 h-2.5" />
              {coupon.used_count}/{coupon.usage_limit} utilisations
            </span>
          )}
          {formatExpiry() && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              Expire le {formatExpiry()}
            </span>
          )}
        </div>

        {usagePercentage > 0 && usagePercentage < 100 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 rounded-full ${usagePercentage >= 80 ? 'bg-red-500' :
                  usagePercentage >= 60 ? 'bg-orange-500' :
                    usagePercentage >= 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                  }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PromotionBanner — Affiche une bannière promo
// ─────────────────────────────────────────────
function PromotionBanner({ promotion }: { promotion: Promotion }) {
  const imageUrl = promotion.banner_image || promotion.image_url || "/placeholder.png"
  
  const discountText = promotion.discount_percentage 
    ? `-${promotion.discount_percentage}%`
    : promotion.discount_amount 
      ? `-${promotion.discount_amount} FCFA`
      : null

  const gradientColors: Record<string, string> = {
    banner: "from-primary/80 to-transparent",
    flash_sale: "from-red-600/80 to-transparent",
    category_offer: "from-green-600/80 to-transparent",
  }

  const gradient = gradientColors[promotion.type] || "from-primary/80 to-transparent"

  return (
    <div className="relative overflow-hidden rounded-xl group">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} z-10`} />
      <Image 
        src={imageUrl} 
        alt={promotion.title} 
        width={600} 
        height={400}
        className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-center p-8">
        <div className="max-w-xs">
          {discountText && (
            <Badge className="mb-2 bg-white/20 text-white border-0">
              {discountText}
            </Badge>
          )}
          <h3 className="text-white text-2xl font-bold mb-2">{promotion.title}</h3>
          <p className="text-white/90 mb-4">{promotion.description}</p>
          <Link href={promotion.link || `/promotions/${promotion.id}`}>
            <Button className="bg-white text-primary hover:bg-white/90">
              {promotion.button_text || "En profiter"}
            </Button>
          </Link>
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
    <div className="flex items-stretch bg-white border border-dashed border-muted rounded-xl overflow-hidden animate-pulse h-[110px]">
      <div className="w-2 bg-muted shrink-0" />
      <div className="w-20 bg-muted/50 border-r border-dashed border-muted shrink-0" />
      <div className="flex-1 px-4 py-3 space-y-2">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-5 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-1/3" />
        <div className="h-1 bg-muted rounded w-full" />
      </div>
    </div>
  )
}

function PromotionSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-200 animate-pulse h-[300px]">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-transparent" />
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function PromotionsPage() {
  const { coupons, loading: couponsLoading, error: couponsError, refetch: refetchCoupons } = useCoupons()
  const { promotions, loading: promotionsLoading, error: promotionsError, refetch: refetchPromotions } = usePromotions()

  const activeCoupons = coupons.filter(c => c.status === "active")
  
  // Séparer les différents types de promotions
  const banners = promotions.filter(p => p.type === "banner" && p.status === "active")
  const flashSales = promotions.filter(p => p.type === "flash_sale" && p.status === "active")
  const categoryOffers = promotions.filter(p => p.type === "category_offer" && p.status === "active")

  // Prendre la première bannière pour la grande bannière si elle existe
  const mainBanner = banners[0]
  const secondaryBanners = banners.slice(1, 3)

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Offres Spéciales</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profitez de nos promotions exclusives et économisez sur vos produits préférés
          </p>
        </div>

        {/* Loading */}
        {promotionsLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PromotionSkeleton />
            <PromotionSkeleton />
          </div>
        )}

        {/* Erreur API */}
        {promotionsError && !promotionsLoading && (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-red-200">
            <Gift className="w-8 h-8 mx-auto mb-3 text-red-300" />
            <p className="text-sm font-medium text-red-500 mb-1">Impossible de charger les promotions</p>
            <p className="text-xs text-muted-foreground mb-4">{promotionsError}</p>
            <Button variant="outline" size="sm" onClick={refetchPromotions} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Réessayer
            </Button>
          </div>
        )}

        {/* Bannières depuis l'API uniquement */}
        {!promotionsLoading && !promotionsError && (
          <>
            {/* Grande bannière principale */}
            {mainBanner && (
              <div className="mb-8">
                <PromotionBanner promotion={mainBanner} />
              </div>
            )}

            {/* Bannières secondaires (2 colonnes) */}
            {secondaryBanners.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {secondaryBanners.map((promo) => (
                  <PromotionBanner key={promo.id} promotion={promo} />
                ))}
              </div>
            )}

            {/* Aucune bannière */}
            {banners.length === 0 && !promotionsLoading && (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                <Gift className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">Aucune promotion disponible pour le moment</p>
              </div>
            )}
          </>
        )}

        {/* Flash Sales */}
        {!promotionsLoading && !promotionsError && flashSales.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold">Flash Sales ⚡</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {flashSales.map((promo) => (
                <PromotionBanner key={promo.id} promotion={promo} />
              ))}
            </div>
          </div>
        )}

        {/* Category Offers */}
        {!promotionsLoading && !promotionsError && categoryOffers.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold">Offres par catégorie</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {categoryOffers.map((promo) => (
                <PromotionBanner key={promo.id} promotion={promo} />
              ))}
            </div>
          </div>
        )}

        {/* ── Coupons ── */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold">Codes promo disponibles</h3>
              {!couponsLoading && activeCoupons.length > 0 && (
                <Badge variant="secondary">
                  {activeCoupons.length} coupon{activeCoupons.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            {couponsError && (
              <Button variant="outline" size="sm" onClick={refetchCoupons} className="gap-2">
                <RefreshCw className="w-4 h-4" />Réessayer
              </Button>
            )}
          </div>

          {couponsError ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-red-200">
              <Tag className="w-8 h-8 mx-auto mb-3 text-red-300" />
              <p className="text-sm font-medium text-red-500 mb-1">Impossible de charger les coupons</p>
              <p className="text-xs text-muted-foreground">{couponsError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {couponsLoading && Array.from({ length: 6 }).map((_, i) => <CouponSkeleton key={i} />)}
              {!couponsLoading && activeCoupons.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground bg-white rounded-xl border border-dashed">
                  <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun coupon disponible pour le moment</p>
                </div>
              )}
              {!couponsLoading && activeCoupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} />)}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
