"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  Eye,
  Search,
  ChevronRight,
  Percent,
  ShoppingBag,
  ArrowUpRight,
  MoreHorizontal,
  Copy,
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

// Types
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

export default function MerchantDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [merchantCategories, setMerchantCategories] = useState<Category[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardResponse['data'] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false)
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
  })
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    validUntil: "",
    usageLimit: "",
    productId: "all", // Changé de "" à "all"
  })

  // Vérifier si l'utilisateur est marchand
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

  // Charger les catégories du marchand (utilise user.uuid)
  const fetchMerchantCategories = async () => {
    if (!user) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/merchant/categories/${user.uuid}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMerchantCategories(result.data)
      }
    } catch (error) {
      console.error('Erreur chargement catégories marchand:', error)
    }
  }

  // Charger les données du dashboard (utilise user.uuid)
  const fetchDashboardData = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/merchant/dashboard/${user.uuid}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('API Response:', text)
        throw new Error('Erreur lors du chargement des données')
      }

      const result: DashboardResponse = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      } else {
        throw new Error('Données invalides')
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de charger les données",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user && (user.role === "marchant" || user.role === "merchant")) {
      fetchMerchantCategories()
      // fetchDashboardData() // Décommentez quand l'API dashboard sera prête
    }
  }, [user])

  // Ajouter un produit (utilise user.uuid)
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
      const token = localStorage.getItem('token')
      const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/merchant/products/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          stock: parseInt(productForm.stock),
          category_name: productForm.category,
          image_url: productForm.image_url,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Succès",
          description: `${productForm.name} a été ajouté avec succès.`,
        })
        setIsProductDialogOpen(false)
        setProductForm({ name: "", description: "", price: "", stock: "", category: "", image_url: "" })
        await fetchMerchantCategories()
      } else {
        throw new Error(result.message || "Erreur lors de l'ajout")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le produit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Ajouter une catégorie (utilise user.uuid)
  const handleAddCategory = async () => {
    if (!user) return
    
    if (!categoryForm.name) {
      toast({
        title: "Champ manquant",
        description: "Veuillez entrer un nom de catégorie",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/merchant/categories/${user.uuid}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryForm.name,
          slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchMerchantCategories()
        toast({
          title: "Succès",
          description: `${categoryForm.name} a été ajoutée avec succès.`,
        })
        setIsCategoryDialogOpen(false)
        setCategoryForm({ name: "", slug: "" })
      } else {
        throw new Error(result.message || "Erreur lors de l'ajout")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter la catégorie",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Ajouter un coupon (utilise user.uuid)
  const handleAddCoupon = async () => {
    if (!user) return
    
    if (!couponForm.code || !couponForm.discount) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir le code et la réduction",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Gérer la valeur "all" comme null pour productId
      const productId = couponForm.productId === "all" ? null : parseInt(couponForm.productId)
      
      const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/merchant/coupons/${user.uuid}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponForm.code.toUpperCase(),
          discount: parseFloat(couponForm.discount),
          type: couponForm.type,
          validUntil: couponForm.validUntil,
          usageLimit: parseInt(couponForm.usageLimit) || 1,
          productId: productId, // Sera null pour "tous les produits"
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Succès",
          description: `${couponForm.code} a été créé avec succès.`,
        })
        setIsCouponDialogOpen(false)
        setCouponForm({ code: "", discount: "", type: "percentage", validUntil: "", usageLimit: "", productId: "all" })
      } else {
        throw new Error(result.message || "Erreur lors de l'ajout")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le code promo",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Supprimer un produit (utilise user.uuid)
  const handleDeleteProduct = async (productId: number) => {
    if (!user) return
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://ecomerce-api-1-dp0w.onrender.com/api/merchant/products/${user.uuid}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Succès",
          description: "Le produit a été supprimé avec succès.",
        })
      } else {
        throw new Error(result.message || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de supprimer le produit",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!user || (user.role !== "marchant" && user.role !== "merchant")) {
    return null
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalLikes: 0,
    pendingOrders: 0,
    averageRating: 0,
    revenueChange: 0,
    salesChange: 0,
  }

  const products = dashboardData?.products || []
  const categories = dashboardData?.categories || []
  const coupons = dashboardData?.coupons || []
  const salesChart = dashboardData?.salesChart || []
  const pendingOrders = dashboardData?.pendingOrders || []
  const popularProducts = dashboardData?.popularProducts || []
  const merchant = dashboardData?.merchant

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="h-4 w-4 mr-2" />
              Produits ({stats.totalProducts})
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Tag className="h-4 w-4 mr-2" />
              Catégories ({merchantCategories.length})
            </TabsTrigger>
            <TabsTrigger value="coupons" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Percent className="h-4 w-4 mr-2" />
              Promos ({coupons.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Produits</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ventes totales</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalSales}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenus</p>
                      <p className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">J'aime</p>
                      <p className="text-2xl font-bold mt-1">{stats.totalLikes}</p>
                    </div>
                    <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Performance des ventes</CardTitle>
                  <CardDescription>Évolution des ventes sur les 30 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-1">
                    {salesChart.length > 0 ? salesChart.map((data, i) => {
                      const maxSales = Math.max(...salesChart.map(d => d.sales), 1)
                      const height = (data.sales / maxSales) * 200
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div 
                            className="w-full bg-primary rounded-t-lg transition-all duration-300"
                            style={{ height: `${height}px` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {i % 5 === 0 ? new Date(data.date).getDate() : ""}
                          </span>
                        </div>
                      )
                    }) : (
                      <div className="w-full text-center text-muted-foreground">Aucune donnée disponible</div>
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
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                  {popularProducts.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Aucune vente récente</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Commandes en attente */}
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
                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                        En attente
                      </Badge>
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

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsProductDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>

            {/* Dialog Ajouter produit */}
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Ajouter un produit</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour ajouter un nouveau produit.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Ex: Tomates Bio"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Description du produit..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (FCFA) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="2500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        placeholder="50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {merchantCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de l'image</Label>
                    <Input
                      id="image_url"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddProduct} disabled={isLoading}>
                    {isLoading ? "Ajout..." : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card className="border-none shadow-lg">
              <CardContent className="p-0">
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
                            <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <span className="truncate max-w-[150px]">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>
                            {product.stock}
                          </span>
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
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
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

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCategoryDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une catégorie
              </Button>
            </div>

            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une catégorie</DialogTitle>
                  <DialogDescription>
                    Créez une nouvelle catégorie pour organiser vos produits.
                  </DialogDescription>
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
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddCategory} disabled={isLoading}>
                    {isLoading ? "Ajout..." : "Ajouter"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Afficher les catégories du marchand */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchantCategories.map((category) => (
                <Card key={category.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Tag className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{category.productCount || 0} produits</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">/categories/{category.slug}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
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

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="space-y-6">
            <div className="flex justify-end">
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsCouponDialogOpen(true)}>
                <Percent className="h-4 w-4 mr-2" />
                Créer un code promo
              </Button>
            </div>

            <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Créer un code promo</DialogTitle>
                  <DialogDescription>
                    Créez une promotion pour booster vos ventes.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code promo *</Label>
                    <Input
                      id="code"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      placeholder="BIENVENUE10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Réduction *</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={couponForm.type}
                        onValueChange={(value: "percentage" | "fixed") => setCouponForm({ ...couponForm, type: value })}
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
                      <Label htmlFor="validUntil">Valide jusqu'au</Label>
                      <Input
                        id="validUntil"
                        type="date"
                        value={couponForm.validUntil}
                        onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usageLimit">Limite d'utilisation</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={couponForm.usageLimit}
                        onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productId">Produit spécifique (optionnel)</Label>
                    <Select
                      value={couponForm.productId}
                      onValueChange={(value) => setCouponForm({ ...couponForm, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les produits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les produits</SelectItem> {/* Changé de "" à "all" */}
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
                  <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddCoupon} disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
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
                          {formatDate(coupon.validUntil)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Utilisations</span>
                        <span className="font-medium">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </span>
                      </div>
                      <Progress value={(coupon.usedCount / coupon.usageLimit) * 100} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                      navigator.clipboard.writeText(coupon.code)
                      toast({ title: "Code copié", description: "Code promo copié dans le presse-papier" })
                    }}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copier
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {coupons.length === 0 && (
                <Card className="col-span-full border-none shadow-lg">
                  <CardContent className="p-12 text-center text-muted-foreground">
                    Aucun code promo créé
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}