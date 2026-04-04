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
  Menu,
  Loader2,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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

const API_URL = "https://ecomerce-api-1-dp0w.onrender.com/api"

// ==================== TYPES ====================
interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  category: string
  categoryId: string
  isNew: boolean
  isOnSale: boolean
  createdAt: string
}

interface Category {
  id: string
  name: string
  description: string
  image_url: string
  productCount?: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  total: number
  status: string
  created_at: string
  items: any[]
}

interface Coupon {
  id: string
  code: string
  discount: number
  type: string
  usedCount: number
  usageLimit: number | null
}

interface DashboardData {
  merchant: {
    full_name: string
    availableBalance: number
  }
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function MerchantDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  
  // États pour les données
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [merchantCategories, setMerchantCategories] = useState<Category[]>([])
  const [merchantOrders, setMerchantOrders] = useState<Order[]>([])
  const [merchantCoupons, setMerchantCoupons] = useState<Coupon[]>([])
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  
  const [ordersStats, setOrdersStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalItems: 0,
    pendingOrders: 0
  })
  
  // États pour le chargement
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // États pour les dialogues
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false)
  
  // États pour l'édition
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  
  // État pour le nouveau produit
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image_url: ""
  })
  
  // État pour la nouvelle catégorie
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image_url: ""
  })
  
  // État pour le nouveau coupon
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage",
    usageLimit: ""
  })
  
  // État pour l'upload d'image
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Commandes récentes (pour l'aperçu)
  const recentOrders = merchantOrders.slice(0, 5)

  // ==================== FONCTIONS UTILITAIRES ====================
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + " FCFA"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "processing":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En cours</Badge>
      case "shipped":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Expédiée</Badge>
      case "delivered":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Livrée</Badge>
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Annulée</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-600" />
      case "processing":
        return <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
      case "shipped":
        return <Truck className="h-3 w-3 text-purple-600" />
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "cancelled":
        return <XCircle className="h-3 w-3 text-red-600" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  // ==================== CHARGEMENT DES DONNÉES ====================
  useEffect(() => {
    // ✅ CORRECTION ICI - Utiliser && au lieu de ||
    const allowedRoles = ["marchant", "marchant", "marchant"]
    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/")
      return
    }
    
    fetchAllData()
  }, [user])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchCoupons()
      ])
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/products/merchant`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      const data = await response.json()
      
      if (data.success) {
        const productsData = data.data.map((p: any) => ({
          ...p,
          price: typeof p.price === 'string' ? parseFloat(p.price) : p.price
        }))
        setProducts(productsData)
        setStats(prev => ({ ...prev, totalProducts: productsData.length }))
      }
    } catch (error) {
      console.error("Erreur chargement produits:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/categories/merchant`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setMerchantCategories(data.data)
      }
    } catch (error) {
      console.error("Erreur chargement catégories:", error)
    }
  }

  const fetchOrders = async () => {
    setIsLoadingOrders(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/orders/merchant`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setMerchantOrders(data.data)
        
        const totalRevenue = data.data.reduce((sum: number, order: any) => sum + order.total, 0)
        const totalItems = data.data.reduce((sum: number, order: any) => sum + order.items.length, 0)
        const pendingOrders = data.data.filter((o: any) => o.status === "pending").length
        
        setOrdersStats({
          totalOrders: data.data.length,
          totalRevenue,
          totalItems,
          pendingOrders
        })
        
        setStats(prev => ({
          ...prev,
          totalOrders: data.data.length,
          totalRevenue,
          pendingOrders
        }))
      }
    } catch (error) {
      console.error("Erreur chargement commandes:", error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/coupons/merchant`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      const data = await response.json()
      
      if (data.success) {
        setMerchantCoupons(data.data)
      }
    } catch (error) {
      console.error("Erreur chargement coupons:", error)
    }
  }

  // ==================== GESTION DES PRODUITS ====================
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock) || 0,
          categoryId: newProduct.categoryId || null,
          imageUrl: newProduct.image_url,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Produit créé avec succès",
        })
        setIsProductDialogOpen(false)
        setNewProduct({ name: "", description: "", price: "", stock: "", categoryId: "", image_url: "" })
        fetchProducts()
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de créer le produit",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur création produit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès",
        })
        fetchProducts()
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de supprimer le produit",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur suppression produit:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      })
    }
  }

  // ==================== GESTION DES CATÉGORIES ====================
  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom de catégorie",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description,
          imageUrl: newCategory.image_url,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Catégorie créée avec succès",
        })
        setIsCategoryDialogOpen(false)
        setNewCategory({ name: "", description: "", image_url: "" })
        fetchCategories()
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de créer la catégorie",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur création catégorie:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Catégorie supprimée avec succès",
        })
        fetchCategories()
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de supprimer la catégorie",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur suppression catégorie:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      })
    }
  }

  // ==================== GESTION DES COUPONS ====================
  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          code: newCoupon.code.toUpperCase(),
          discount: parseFloat(newCoupon.discount),
          type: newCoupon.type,
          usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Code promo créé avec succès",
        })
        setIsCouponDialogOpen(false)
        setNewCoupon({ code: "", discount: "", type: "percentage", usageLimit: "" })
        fetchCoupons()
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de créer le coupon",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur création coupon:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer le coupon",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce coupon ?")) return
    
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Coupon supprimé avec succès",
        })
        fetchCoupons()
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de supprimer le coupon",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur suppression coupon:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le coupon",
        variant: "destructive",
      })
    }
  }

  // Produits filtrés
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ==================== COMPOSANT CARTE STATS ====================
  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <Card className="border-none shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`h-10 w-10 sm:h-12 sm:w-12 bg-${color}/10 rounded-full flex items-center justify-center`}>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Vérification de l'authentification - ✅ CORRIGÉE
  const allowedRoles = ["marchand", "merchant", "merchand"]
  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  // ==================== RENDU PRINCIPAL ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 sm:pt-20">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Gérez votre boutique
              </p>
            </div>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user?.full_name?.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user?.full_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { value: "overview", label: "Aperçu", icon: LayoutDashboard },
                    { value: "products", label: "Produits", icon: Package, count: stats.totalProducts },
                    { value: "orders", label: "Commandes", icon: ShoppingBag, count: ordersStats.totalOrders },
                    { value: "categories", label: "Catégories", icon: Tag, count: merchantCategories.length },
                    { value: "coupons", label: "Promos", icon: Percent, count: merchantCoupons.length },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setActiveTab(tab.value)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeTab === tab.value
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      {tab.count !== undefined && (
                        <Badge variant={activeTab === tab.value ? "default" : "secondary"} className="text-xs">
                          {tab.count}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos produits, commandes et promotions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Solde disponible</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.full_name?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Produits" value={stats.totalProducts} icon={Package} color="primary" />
          <StatCard label="Commandes" value={ordersStats.totalOrders} icon={ShoppingBag} color="blue-500" />
          <StatCard label="Chiffre d'affaires" value={formatCurrency(ordersStats.totalRevenue)} icon={TrendingUp} color="green-500" />
          <StatCard label="En attente" value={ordersStats.pendingOrders} icon={Clock} color="orange-500" />
        </div>

        {/* Desktop Tabs - Suite du code... */}
        <div className="hidden md:block">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto flex flex-nowrap">
              <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white whitespace-nowrap">
                <LayoutDashboard className="h-4 w-4 mr-2" />Aperçu
              </TabsTrigger>
              <TabsTrigger value="products" className="rounded-md data-[state=active]:bg-white whitespace-nowrap">
                <Package className="h-4 w-4 mr-2" />Produits ({stats.totalProducts})
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-md data-[state=active]:bg-white whitespace-nowrap">
                <ShoppingBag className="h-4 w-4 mr-2" />Commandes ({ordersStats.totalOrders})
              </TabsTrigger>
              <TabsTrigger value="categories" className="rounded-md data-[state=active]:bg-white whitespace-nowrap">
                <Tag className="h-4 w-4 mr-2" />Catégories ({merchantCategories.length})
              </TabsTrigger>
              <TabsTrigger value="coupons" className="rounded-md data-[state=active]:bg-white whitespace-nowrap">
                <Percent className="h-4 w-4 mr-2" />Promos ({merchantCoupons.length})
              </TabsTrigger>
            </TabsList>

            {/* Onglet Aperçu Desktop */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Commandes récentes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Commandes récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                      </div>
                    ) : recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(order.total)}</p>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Aucune commande</p>
                    )}
                  </CardContent>
                </Card>

                {/* Produits populaires */}
                <Card>
                  <CardHeader>
                    <CardTitle>Produits récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border-b last:border-0">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                        <p className="font-bold text-primary">{formatCurrency(product.price)}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Produits Desktop - (conserve le reste du code existant) */}
            <TabsContent value="products" className="space-y-6">
              {/* ... le reste du code pour les produits ... */}
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => setIsProductDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="h-5 w-5 text-gray-400 m-2.5" />
                                )}
                              </div>
                              <span>{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.category || "Non catégorisé"}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <Badge variant={product.stock > 0 ? "outline" : "destructive"}>
                              {product.stock > 0 ? `${product.stock} unités` : "Rupture"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.isNew && <Badge className="bg-green-500">Nouveau</Badge>}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Les autres onglets (commandes, catégories, coupons) - conserve ton code existant */}
          </Tabs>
        </div>

        {/* Version Mobile */}
        <div className="md:hidden">
          <div className="space-y-4">
            {activeTab === "overview" && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-center text-muted-foreground">Version mobile en cours d'optimisation</p>
                </CardContent>
              </Card>
            )}
            {activeTab === "products" && (
              <div className="space-y-4">
                <Button onClick={() => setIsProductDialogOpen(true)} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
                {filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400 m-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
                          <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Ajout Produit - (conserve ton code existant) */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
            <DialogDescription>
              Remplissez les informations du produit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du produit *</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ex: T-shirt premium"
                />
              </div>
              <div className="space-y-2">
                <Label>Prix *</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Ex: 5000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Description du produit..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="Quantité en stock"
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {merchantCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setNewProduct({ ...newProduct, image_url: res[0].url })
                    toast({ title: "Image uploadée avec succès" })
                  }
                }}
                onUploadError={(error) => {
                  toast({ title: "Erreur upload", description: error.message, variant: "destructive" })
                }}
              />
              {newProduct.image_url && (
                <div className="mt-2 relative h-32 w-32">
                  <img src={newProduct.image_url} alt="Aperçu" className="w-full h-full object-cover rounded" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateProduct}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ajout Catégorie */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setNewCategory({ ...newCategory, image_url: res[0].url })
                  }
                }}
                onUploadError={(error) => {
                  toast({ title: "Erreur upload", variant: "destructive" })
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateCategory}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ajout Coupon */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un code promo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Code promo *</Label>
              <Input
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="Ex: PROMO10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Réduction *</Label>
                <Input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newCoupon.type} onValueChange={(value) => setNewCoupon({ ...newCoupon, type: value })}>
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
            <div className="space-y-2">
              <Label>Limite d'utilisations (optionnel)</Label>
              <Input
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                placeholder="Laissez vide pour illimité"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCouponDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateCoupon}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
