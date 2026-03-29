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

// UploadThing — généré depuis lib/uploadthing.ts
import { UploadButton } from "@/lib/uploadthing"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Product {
  id: number
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

  // ── Data state ────────────────────────────
  const [dashboardData, setDashboardData] = useState<DashboardResponse["data"] | null>(null)
  const [merchantCoupons, setMerchantCoupons] = useState<Coupon[]>([])
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false)
  const [merchantCategories, setMerchantCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

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
      if (result.success) setDashboardData(result.data)
      else throw new Error("Données invalides")
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

  useEffect(() => {
    if (user && (user.role === "marchant" || user.role === "merchant")) {
      fetchDashboardData()
      fetchMerchantCategories()
      fetchMerchantCoupons()
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

  const handleDeleteProduct = async (productId: number) => {
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
          slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, "-"),
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
          slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, "-"),
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
  // Formatters
  // ─────────────────────────────────────────
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })

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
  const pendingOrders = dashboardData?.pendingOrders || []
  const popularProducts = dashboardData?.popularProducts || []
  const merchant = dashboardData?.merchant

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                        {formatCurrency(merchant?.availableBalance || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                { label: "Ventes totales", value: stats.totalSales, icon: ShoppingBag, color: "green-500" },
                { label: "Revenus", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "primary" },
                { label: "J'aime", value: stats.totalLikes, icon: Heart, color: "red-500" },
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

            {/* Chart + Popular products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Performance des ventes</CardTitle>
                  <CardDescription>Évolution sur les 30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-1">
                    {salesChart.length > 0 ? salesChart.map((data, i) => {
                      const maxSales = Math.max(...salesChart.map((d) => d.sales), 1)
                      const height = (data.sales / maxSales) * 200
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-primary rounded-t-lg transition-all duration-300" style={{ height: `${height}px` }} />
                          <span className="text-xs text-muted-foreground">
                            {i % 5 === 0 ? new Date(data.date).getDate() : ""}
                          </span>
                        </div>
                      )
                    }) : (
                      <div className="w-full text-center text-muted-foreground self-center">Aucune donnée disponible</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Produits populaires</CardTitle>
                  <CardDescription>Les plus vendus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} ventes</p>
                      </div>
                      <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                    </div>
                  ))}
                  {popularProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Aucune vente récente</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Pending orders */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Commandes en attente</CardTitle>
                <CardDescription>{stats.pendingOrders} commande(s) à traiter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">Client: {order.customerName}</p>
                        <p className="text-sm text-muted-foreground">Montant: {formatCurrency(order.total)}</p>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">En attente</Badge>
                    </div>
                  ))}
                  {pendingOrders.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Aucune commande en attente</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Voir toutes les commandes
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
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

                  {/* UploadThing — image produit */}
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

                  {/* UploadThing — image catégorie */}
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

                    {/* UploadThing — image catégorie (édition) */}
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
                  {/* Bannière image */}
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
                    {/* Overlay badge */}
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

            {/* Dialog — Créer coupon */}
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

            {/* Grid coupons */}
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
    </div>
  )
}