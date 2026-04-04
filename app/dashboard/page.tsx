"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Heart,
  Tag,
  TrendingUp,
  Wallet,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronRight,
  Percent,
  ShoppingBag,
  MoreHorizontal,
  Copy,
  X,
  ImageIcon,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

// UploadThing
import { UploadButton } from "@/lib/uploadthing"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  category: string
  likes: number
  sales: number
  createdAt: string
  status: "active" | "inactive"
}

interface Category {
  id: number
  name: string
  slug: string
  image_url?: string
  productCount: number
}

interface Coupon {
  id: number
  code: string
  discount: number
  type: "percentage" | "fixed"
  validUntil: string
  usageLimit: number
  usedCount: number
  productId?: number
  productName?: string
}

interface DashboardStats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalLikes: number
  pendingOrders: number
  averageRating: number
  revenueChange: number
  salesChange: number
}

interface SalesDataPoint {
  date: string
  sales: number
  revenue: number
}

interface PopularProduct {
  id: number
  name: string
  sales: number
  revenue: number
}

interface PendingOrder {
  id: string
  orderNumber: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

interface MerchantInfo {
  id: number
  uuid: string
  full_name: string
  email: string
  avatar: string | null
  availableBalance: number
}

interface DashboardResponse {
  success: boolean
  data: {
    stats: DashboardStats
    products: Product[]
    categories: Category[]
    coupons: Coupon[]
    salesChart: SalesDataPoint[]
    pendingOrders: PendingOrder[]
    popularProducts: PopularProduct[]
    merchant: MerchantInfo
  }
}

// Types pour les commandes
interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_description: string | null
  price: number
  quantity: number
  subtotal: number
  category: string | null
  image: string | null
}

interface OrderTracking {
  status: string
  description: string | null
  location: string | null
  tracked_at: string
}

interface MerchantOrder {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  shipping_cost: number
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: string
  payment_method: string
  tracking_number: string | null
  created_at: string
  estimated_delivery: string | null
  delivered_at: string | null
  notes: string | null
  items: OrderItem[]
  tracking: OrderTracking | null
  user: {
    id: string
    full_name: string
    email: string
  } | null
}

interface OrdersStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalItems: number
  averageOrderValue: number
}

interface WithdrawalHistory {
  id: string
  amount: number
  status: string
  payment_method: string
  account_number: string
  account_name: string
  operator: string | null
  reference: string
  created_at: string
}

// ─────────────────────────────────────────────
// Composant ImageUploadPreview réutilisable
// ─────────────────────────────────────────────
function ImageUploadPreview({
  imageUrl,
  onRemove,
  endpoint,
  onUploadComplete,
  label = "Image",
}: {
  imageUrl: string
  onRemove: () => void
  endpoint: "productImage" | "categoryImage"
  onUploadComplete: (url: string) => void
  label?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-4 items-start flex-wrap">
        {imageUrl ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
            <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-black/80 transition"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 flex-shrink-0">
            <ImageIcon className="h-8 w-8 text-gray-300" />
          </div>
        )}

        <div className="flex flex-col justify-center">
          <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.url
              if (url) {
                onUploadComplete(url)
                toast({
                  title: "Image uploadée",
                  description: "L'image a été téléchargée avec succès",
                })
              }
            }}
            onUploadError={(error: Error) => {
              toast({
                title: "Erreur d'upload",
                description: error.message,
                variant: "destructive",
              })
            }}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {endpoint === "productImage" ? "Max 4MB" : "Max 2MB"} · JPG, PNG, WEBP
          </p>
        </div>
      </div>

      {imageUrl && (
        <p className="text-xs text-muted-foreground break-all">
          URL: {imageUrl.substring(0, 70)}...
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Dashboard principal
// ─────────────────────────────────────────────
export default function MerchantDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // ── UI state ──────────────────────────────
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // ── Dialog open/close ────────────────────
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false)
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)

  // ── Data state ────────────────────────────
  const [dashboardData, setDashboardData] = useState<DashboardResponse["data"] | null>(null)
  const [merchantCoupons, setMerchantCoupons] = useState<Coupon[]>([])
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  const [merchantCategories, setMerchantCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // ── Orders state ──────────────────────────
  const [merchantOrders, setMerchantOrders] = useState<MerchantOrder[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [ordersStats, setOrdersStats] = useState<OrdersStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalItems: 0,
    averageOrderValue: 0
  })

  // ── Withdrawal state ──────────────────────
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([])
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(false)
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    phoneNumber: "",
    operator_code: "auto",
  })
  const [balance, setBalance] = useState(0)

  // ── Form state ────────────────────────────
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image_url: "",
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    image_url: "",
  })

  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    validUntil: "",
    usageLimit: "",
    productId: "all",
  })

  // ─────────────────────────────────────────
  // Auth guard
  // ─────────────────────────────────────────
  useEffect(() => {
    if (user && user.role !== "marchant" && user.role !== "merchant") {
      router.push("/")
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour accéder à cette page.",
        variant: "destructive",
      })
    }
  }, [user, router])

  // ─────────────────────────────────────────
  // Helpers token
  // ─────────────────────────────────────────
  const authHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    }
  }

  const BASE = "http://127.0.0.1:3333/api/merchant"

  // ─────────────────────────────────────────
  // Fetchers
  // ─────────────────────────────────────────
  const fetchDashboardData = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/dashboard/${user.id}`, { headers: authHeaders() })
      if (!res.ok) throw new Error("Erreur lors du chargement des données")
      const result: DashboardResponse = await res.json()
      if (result.success) {
        setDashboardData(result.data)
        setBalance(result.data.merchant?.availableBalance || 0)
      } else throw new Error("Données invalides")
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les données",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMerchantCategories = async () => {
    if (!user) return
    try {
      const res = await fetch(`${BASE}/categories/${user.id}`, { headers: authHeaders() })
      const result = await res.json()
      if (result.success) setMerchantCategories(result.data)
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
    }
  }

  const fetchMerchantCoupons = async () => {
    if (!user) return
    setIsLoadingCoupons(true)
    try {
      const res = await fetch(`${BASE}/coupons/${user.id}`, { headers: authHeaders() })
      const result = await res.json()
      if (result.success) setMerchantCoupons(result.data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes promo",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCoupons(false)
    }
  }

  const fetchMerchantOrders = async () => {
    if (!user) return
    setIsLoadingOrders(true)
    try {
      const res = await fetch(`${BASE}/orders/all/${user.id}`, { headers: authHeaders() })
      const result = await res.json()
      console.log("Orders response:", result)

      if (result.success) {
        setMerchantOrders(result.data || [])
        if (result.stats) {
          setOrdersStats(result.stats)
        }
      } else {
        throw new Error(result.message || "Erreur lors du chargement des commandes")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les commandes",
        variant: "destructive",
      })
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const fetchWithdrawalHistory = async () => {
    if (!user) return
    setIsLoadingWithdrawals(true)
    try {
      const res = await fetch(`${BASE}/withdrawals/${user.id}`, { headers: authHeaders() })
      const result = await res.json()
      if (result.success) {
        setWithdrawalHistory(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error)
    } finally {
      setIsLoadingWithdrawals(false)
    }
  }

  // ─────────────────────────────────────────
  // HANDLER — RETRAIT D'ARGENT (GIVE CHANGE)
  // ─────────────────────────────────────────
  const handleWithdrawal = async () => {
    if (!user) return

    const amount = parseFloat(withdrawalForm.amount)
    const phoneNumber = withdrawalForm.phoneNumber.trim()

    if (!amount || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide",
        variant: "destructive",
      })
      return
    }

    if (amount < 150) {
      toast({
        title: "Montant minimum",
        description: "Le montant minimum de retrait est de 150 FCFA",
        variant: "destructive",
      })
      return
    }

    if (!phoneNumber) {
      toast({
        title: "Numéro requis",
        description: "Veuillez entrer le numéro de téléphone du destinataire",
        variant: "destructive",
      })
      return
    }

    if (amount > balance) {
      toast({
        title: "Solde insuffisant",
        description: `Votre solde actuel est de ${balance.toLocaleString()} FCFA. Montant demandé: ${amount.toLocaleString()} FCFA.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const paymentPublicKey = process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY || "pk_1773325888803_dt8diavuh3h"
      const paymentSecretKey = process.env.NEXT_PUBLIC_PAYMENT_SECRET_KEY || "sk_1773325888803_qt015a3cr5"

      const requestBody: any = {
        userId: user.id,
        amount: amount,
        customer_account_number: phoneNumber,
        payment_api_key_public: paymentPublicKey,
        payment_api_key_secret: paymentSecretKey,
        notes: `Retrait depuis dashboard marchand ${user.full_name}`
      }

      // Ajouter operator_code seulement s'il est fourni
      if (withdrawalForm.operator_code && withdrawalForm.operator_code !== "auto") {
        requestBody.operator_code = withdrawalForm.operator_code
      }

      const res = await fetch(`${BASE}/give-change`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(requestBody),
      })

      const result = await res.json()
      console.log("Withdrawal response:", result)

      if (result.success) {
        toast({
          title: "Retrait effectué avec succès",
          description: `${amount.toLocaleString()} FCFA envoyés à ${phoneNumber}`,
        })
        // Mettre à jour le solde
        setBalance(result.data.new_balance)
        // Fermer le dialogue
        setIsWithdrawalDialogOpen(false)
        // Réinitialiser le formulaire
            setWithdrawalForm({ amount: "", phoneNumber: "", operator_code: "auto" })
        // Rafraîchir l'historique
        await fetchWithdrawalHistory()
        // Rafraîchir les données du dashboard
        await fetchDashboardData()
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Impossible d'effectuer le retrait",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during withdrawal:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'effectuer le retrait",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && (user.role === "marchant" || user.role === "merchant")) {
      fetchDashboardData()
      fetchMerchantCategories()
      fetchMerchantCoupons()
      fetchMerchantOrders()
      fetchWithdrawalHistory()
    }
  }, [user])

  // ─────────────────────────────────────────
  // Handlers — Produits
  // ─────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!user) return
    if (!productForm.name || !productForm.price || !productForm.stock) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/products/${user.id}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          category_name: productForm.category,
          image_url: productForm.image_url,
        }),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: `${productForm.name} ajouté avec succès.` })
        setIsProductDialogOpen(false)
        setProductForm({ name: "", description: "", price: "", stock: "", category: "", image_url: "" })
        await fetchDashboardData()
        await fetchMerchantCategories()
      } else throw new Error(result.message || "Erreur lors de l'ajout")
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le produit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!user) return
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/products/${user.id}/${productId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: "Produit supprimé avec succès." })
        await fetchDashboardData()
      } else throw new Error(result.message)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer le produit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────
  // Handlers — Catégories
  // ─────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!user) return
    if (!categoryForm.name) {
      toast({ title: "Champ manquant", description: "Veuillez entrer un nom de catégorie", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/categories/${user.id}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: categoryForm.name,
          slug: categoryForm.slug || null,
          image_url: categoryForm.image_url || null,
        }),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: `${categoryForm.name} ajoutée avec succès.` })
        setIsCategoryDialogOpen(false)
        setCategoryForm({ name: "", slug: "", image_url: "" })
        await fetchMerchantCategories()
      } else throw new Error(result.message)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la catégorie",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!user || !editingCategory) return
    if (!editingCategory.name) {
      toast({ title: "Champ manquant", description: "Veuillez entrer un nom de catégorie", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/categories/${user.id}/${editingCategory.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          name: editingCategory.name,
          slug: editingCategory.slug || null,
          image_url: editingCategory.image_url || null,
        }),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: `${editingCategory.name} modifiée avec succès.` })
        setIsEditCategoryDialogOpen(false)
        setEditingCategory(null)
        await fetchMerchantCategories()
      } else throw new Error(result.message)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de modifier la catégorie",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!user) return
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/categories/${user.id}/${categoryId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: "Catégorie supprimée avec succès." })
        await fetchMerchantCategories()
      } else throw new Error(result.message)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer la catégorie",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────
  // Handlers — Coupons
  // ─────────────────────────────────────────
  const handleAddCoupon = async () => {
    if (!user) return
    if (!couponForm.code || !couponForm.discount) {
      toast({ title: "Champs manquants", description: "Veuillez remplir le code et la réduction", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const productId = couponForm.productId === "all" ? null : parseInt(couponForm.productId)
      const res = await fetch(`${BASE}/coupons/${user.id}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          code: couponForm.code.toUpperCase(),
          discount: parseFloat(couponForm.discount),
          type: couponForm.type,
          validUntil: couponForm.validUntil,
          usageLimit: parseInt(couponForm.usageLimit) || 1,
          productId,
        }),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: `${couponForm.code} créé avec succès.` })
        setIsCouponDialogOpen(false)
        setCouponForm({ code: "", discount: "", type: "percentage", validUntil: "", usageLimit: "", productId: "all" })
        await fetchMerchantCoupons()
      } else throw new Error(result.message)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le code promo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCoupon = async (couponId: number) => {
    if (!user) return
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) return
    setIsLoading(true)
    try {
      const res = await fetch(`${BASE}/coupons/${user.id}/${couponId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: "Succès", description: "Code promo supprimé avec succès." })
        await fetchMerchantCoupons()
      } else throw new Error(result.message)
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer le code promo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────
  // Helper pour le statut de commande
  // ─────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">En attente</Badge>
      case 'processing':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">En traitement</Badge>
      case 'shipped':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Expédiée</Badge>
      case 'delivered':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Livrée</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-600 border-red-200">Annulée</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // ─────────────────────────────────────────
  // Formatters
  // ─────────────────────────────────────────
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' })

  // ─────────────────────────────────────────
  // Guards & derived data
  // ─────────────────────────────────────────
  if (!user || (user.role !== "marchant" && user.role !== "merchant")) return null

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    totalProducts: 0, totalSales: 0, totalRevenue: 0,
    totalLikes: 0, pendingOrders: 0, averageRating: 0,
    revenueChange: 0, salesChange: 0,
  }
  const products = dashboardData?.products || []
  const salesChart = dashboardData?.salesChart || []
  const popularProducts = dashboardData?.popularProducts || []
  const merchant = dashboardData?.merchant

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pendingOrdersList = merchantOrders.filter(order => order.status === 'pending')
  const recentOrders = merchantOrders.slice(0, 5)

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">

        {/* ── Header ─────────────────────────────── */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos produits, commandes et promotions
              </p>
              {merchant && (
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>ID: {merchant.id}</span>
                  <span>UUID: {merchant.uuid}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Solde disponible</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(balance)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── BOUTON RETRAIT D'ARGENT ── */}
              <Button
                onClick={() => setIsWithdrawalDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                Retirer
              </Button>

              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {merchant?.full_name?.charAt(0) || user?.full_name?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />Aperçu
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="h-4 w-4 mr-2" />Produits ({stats.totalProducts})
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ShoppingBag className="h-4 w-4 mr-2" />Commandes ({ordersStats.totalOrders})
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Tag className="h-4 w-4 mr-2" />Catégories ({merchantCategories.length})
            </TabsTrigger>
            <TabsTrigger value="coupons" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Percent className="h-4 w-4 mr-2" />Promos ({merchantCoupons.length})
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════
              TAB — OVERVIEW
          ════════════════════════════════════════ */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Produits", value: stats.totalProducts, icon: Package, color: "primary" },
                { label: "Commandes", value: ordersStats.totalOrders, icon: ShoppingBag, color: "blue-500" },
                { label: "Chiffre d'affaires", value: formatCurrency(ordersStats.totalRevenue), icon: TrendingUp, color: "green-500" },
                { label: "En attente", value: ordersStats.pendingOrders, icon: Clock, color: "orange-500" },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label} className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-2xl font-bold mt-1">{value}</p>
                      </div>
                      <div className={`h-12 w-12 bg-${color}/10 rounded-full flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 text-${color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Commandes récentes */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Les 5 dernières commandes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Chargement des commandes...</p>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.customer_name} • {formatDate(order.created_at)}
                            </p>
                            <p className="text-sm font-medium mt-1">{formatCurrency(order.total)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-muted-foreground">
                            {order.items.length} article(s)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucune commande récente</p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("orders")}
                >
                  Voir toutes les commandes
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Statistiques des commandes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Statut des commandes</CardTitle>
                  <CardDescription>Répartition par statut</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "En attente", count: ordersStats.pendingOrders, color: "bg-yellow-500" },
                    { label: "En traitement", count: ordersStats.processingOrders, color: "bg-blue-500" },
                    { label: "Expédiées", count: ordersStats.shippedOrders, color: "bg-purple-500" },
                    { label: "Livrées", count: ordersStats.deliveredOrders, color: "bg-green-500" },
                    { label: "Annulées", count: ordersStats.cancelledOrders, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${ordersStats.totalOrders ? (item.count / ordersStats.totalOrders) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Informations clés</CardTitle>
                  <CardDescription>Résumé des commandes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Total commandes</span>
                    <span className="font-bold text-xl">{ordersStats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Articles vendus</span>
                    <span className="font-bold text-xl">{ordersStats.totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Chiffre d'affaires</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(ordersStats.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Panier moyen</span>
                    <span className="font-bold text-lg">{formatCurrency(ordersStats.averageOrderValue)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════
              TAB — PRODUCTS
          ════════════════════════════════════════ */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsProductDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />Ajouter un produit
              </Button>
            </div>

            {/* Dialog — Ajouter produit */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un produit</DialogTitle>
                  <DialogDescription>Remplissez les informations pour ajouter un nouveau produit.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="prod-name">Nom du produit *</Label>
                    <Input
                      id="prod-name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ex: Tomates Bio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prod-desc">Description</Label>
                    <Textarea
                      id="prod-desc"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Description du produit..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prod-price">Prix (FCFA) *</Label>
                      <Input
                        id="prod-price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="2500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prod-stock">Stock *</Label>
                      <Input
                        id="prod-stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {merchantCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ImageUploadPreview
                    label="Image du produit"
                    imageUrl={productForm.image_url}
                    endpoint="productImage"
                    onUploadComplete={(url) => setProductForm({ ...productForm, image_url: url })}
                    onRemove={() => setProductForm({ ...productForm, image_url: "" })}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsProductDialogOpen(false)
                    setProductForm({ name: "", description: "", price: "", stock: "", category: "", image_url: "" })
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isLoading}>
                    {isLoading ? "Ajout..." : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Table produits */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>J'aime</TableHead>
                      <TableHead>Ventes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <span className="truncate max-w-[150px]">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>{product.stock}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
                            <span>{product.likes}</span>
                          </div>
                        </TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Aucun produit trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════════════════════════════════════════
              TAB — ORDERS
          ════════════════════════════════════════ */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-sm relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une commande..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchMerchantOrders}>
                  Actualiser
                </Button>
              </div>
            </div>

            {isLoadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des commandes...</p>
              </div>
            ) : merchantOrders.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune commande trouvée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {merchantOrders.map((order) => (
                  <Card key={order.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <CardTitle className="text-lg">{order.order_number}</CardTitle>
                            <CardDescription>
                              {formatDateTime(order.created_at)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <Badge variant="outline" className="font-mono">
                            {order.items.length} article(s)
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Client</p>
                          <p className="text-sm">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                          {order.customer_phone && (
                            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Adresse de livraison</p>
                          <p className="text-sm">{order.shipping_address}</p>
                          <p className="text-sm font-medium mt-2">Paiement</p>
                          <p className="text-sm">{order.payment_method}</p>
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium mb-2">Produits commandés</p>
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span>{item.quantity}x {item.product_name}</span>
                              <span>{formatCurrency(item.subtotal)}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-muted-foreground">+ {order.items.length - 3} autres articles</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-3">
                      <div className="flex gap-2">
                        {order.tracking_number && (
                          <Badge variant="outline" className="text-xs">
                            Tracking: {order.tracking_number}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(order.total)}</p>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ════════════════════════════════════════
              TAB — CATEGORIES
          ════════════════════════════════════════ */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCategoryDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />Ajouter une catégorie
              </Button>
            </div>

            {/* Dialog — Ajouter catégorie */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter une catégorie</DialogTitle>
                  <DialogDescription>Créez une nouvelle catégorie pour organiser vos produits.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Nom de la catégorie *</Label>
                    <Input
                      id="cat-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Ex: Fruits Exotiques"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-slug">Slug (URL)</Label>
                    <Input
                      id="cat-slug"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      placeholder="fruits-exotiques"
                    />
                  </div>

                  <ImageUploadPreview
                    label="Image de la catégorie"
                    imageUrl={categoryForm.image_url}
                    endpoint="categoryImage"
                    onUploadComplete={(url) => setCategoryForm({ ...categoryForm, image_url: url })}
                    onRemove={() => setCategoryForm({ ...categoryForm, image_url: "" })}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsCategoryDialogOpen(false)
                    setCategoryForm({ name: "", slug: "", image_url: "" })
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddCategory} disabled={isLoading}>
                    {isLoading ? "Ajout..." : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Dialog — Modifier catégorie */}
            <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Modifier la catégorie</DialogTitle>
                  <DialogDescription>Modifiez les informations de la catégorie.</DialogDescription>
                </DialogHeader>
                {editingCategory && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-cat-name">Nom de la catégorie *</Label>
                      <Input
                        id="edit-cat-name"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        placeholder="Ex: Fruits Exotiques"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-cat-slug">Slug (URL)</Label>
                      <Input
                        id="edit-cat-slug"
                        value={editingCategory.slug}
                        onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                        placeholder="fruits-exotiques"
                      />
                    </div>

                    <ImageUploadPreview
                      label="Image de la catégorie"
                      imageUrl={editingCategory.image_url || ""}
                      endpoint="categoryImage"
                      onUploadComplete={(url) => setEditingCategory({ ...editingCategory, image_url: url })}
                      onRemove={() => setEditingCategory({ ...editingCategory, image_url: "" })}
                    />
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsEditCategoryDialogOpen(false)
                    setEditingCategory(null)
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateCategory} disabled={isLoading}>
                    {isLoading ? "Modification..." : "Modifier"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Grid catégories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchantCategories.map((category) => (
                <Card key={category.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-32 bg-primary/5 overflow-hidden relative">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="h-10 w-10 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700 shadow-sm">
                        {category.productCount || 0} produits
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-0.5">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">/categories/{category.slug}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingCategory(category)
                          setIsEditCategoryDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {merchantCategories.length === 0 && (
                <Card className="col-span-full border-none shadow-lg">
                  <CardContent className="p-12 text-center text-muted-foreground">
                    Aucune catégorie créée. Cliquez sur "Ajouter une catégorie" pour commencer.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* ════════════════════════════════════════
              TAB — COUPONS
          ════════════════════════════════════════ */}
          <TabsContent value="coupons" className="space-y-6">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCouponDialogOpen(true)}>
                <Percent className="h-4 w-4 mr-2" />Créer un code promo
              </Button>
            </div>

            <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Créer un code promo</DialogTitle>
                  <DialogDescription>Créez une promotion pour booster vos ventes.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="coup-code">Code promo *</Label>
                    <Input
                      id="coup-code"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      placeholder="BIENVENUE10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coup-discount">Réduction *</Label>
                      <Input
                        id="coup-discount"
                        type="number"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={couponForm.type}
                        onValueChange={(value: "percentage" | "fixed") =>
                          setCouponForm({ ...couponForm, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                          <SelectItem value="fixed">Montant fixe (FCFA)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coup-until">Valide jusqu'au</Label>
                      <Input
                        id="coup-until"
                        type="date"
                        value={couponForm.validUntil}
                        onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coup-limit">Limite d'utilisation</Label>
                      <Input
                        id="coup-limit"
                        type="number"
                        value={couponForm.usageLimit}
                        onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Produit spécifique (optionnel)</Label>
                    <Select
                      value={couponForm.productId}
                      onValueChange={(value) => setCouponForm({ ...couponForm, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les produits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les produits</SelectItem>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleAddCoupon} disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLoadingCoupons ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des codes promo...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {merchantCoupons.map((coupon) => (
                  <Card key={coupon.id} className="border-none shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-mono">{coupon.code}</CardTitle>
                          <CardDescription>
                            {coupon.type === "percentage"
                              ? `${coupon.discount}% de réduction`
                              : `${formatCurrency(coupon.discount)} de réduction`}
                          </CardDescription>
                        </div>
                        <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                          <Percent className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Validité</span>
                          <span className="font-medium">
                            {coupon.validUntil ? formatDate(coupon.validUntil) : "Illimitée"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Utilisations</span>
                          <span className="font-medium">
                            {coupon.usedCount || 0} / {coupon.usageLimit || "∞"}
                          </span>
                        </div>
                        {coupon.usageLimit && (
                          <Progress
                            value={((coupon.usedCount || 0) / coupon.usageLimit) * 100}
                            className="h-2"
                          />
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code)
                          toast({ title: "Code copié", description: "Code promo copié dans le presse-papier" })
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1" />Copier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />Supprimer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                {merchantCoupons.length === 0 && (
                  <Card className="col-span-full border-none shadow-lg">
                    <CardContent className="p-12 text-center text-muted-foreground">
                      Aucun code promo créé. Cliquez sur "Créer un code promo" pour commencer.
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── DIALOG RETRAIT D'ARGENT ── */}
      <Dialog open={isWithdrawalDialogOpen} onOpenChange={setIsWithdrawalDialogOpen}>
        <DialogContent className="w-[min(90vw,420px)] sm:w-[min(80vw,480px)]">
          <DialogHeader>
            <DialogTitle>Retirer de l'argent</DialogTitle>
            <DialogDescription>
              Envoyez de l'argent depuis votre wallet vers un numéro de téléphone mobile.
              L'opérateur sera détecté automatiquement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Montant (FCFA) *</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Ex: 5000"
                value={withdrawalForm.amount}
                onChange={(e) => setWithdrawalForm({ ...withdrawalForm, amount: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Montant minimum: 150 FCFA | Solde disponible: {formatCurrency(balance)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdraw-phone">Numéro de téléphone *</Label>
              <Input
                id="withdraw-phone"
                type="tel"
                placeholder="Ex: 0746541658"
                value={withdrawalForm.phoneNumber}
                onChange={(e) => setWithdrawalForm({ ...withdrawalForm, phoneNumber: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Format: 074XXXXXX (Airtel) ou 066XXXXXX (Moov). L'opérateur est détecté automatiquement.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdraw-operator">Opérateur (optionnel)</Label>
              <Select
                value={withdrawalForm.operator_code}
                onValueChange={(value) => setWithdrawalForm({ ...withdrawalForm, operator_code: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-détection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-détection</SelectItem>
                  <SelectItem value="airtel">Airtel Money</SelectItem>
                  <SelectItem value="moov">Moov Money</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Laissez vide pour une détection automatique par le numéro
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>⚠️ Information :</strong> Un retrait débitera votre wallet du montant indiqué.
                L'argent sera envoyé directement sur le compte mobile money du destinataire.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsWithdrawalDialogOpen(false)
            setWithdrawalForm({ amount: "", phoneNumber: "", operator_code: "auto" })
            }}>
              Annuler
            </Button>
            <Button
              onClick={handleWithdrawal}
              disabled={isLoading || !withdrawalForm.amount || !withdrawalForm.phoneNumber}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Traitement..." : "Confirmer le retrait"}
              <ArrowUpCircle className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
