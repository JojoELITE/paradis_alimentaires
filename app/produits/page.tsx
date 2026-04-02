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
  Menu,
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

// ... (garde tous tes types et interfaces identiques) ...

export default function MerchantDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // ... (garde tous tes states existants) ...

  // Composant pour les cartes stats (responsive)
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

  if (!user || (user.role !== "marchant" && user.role !== "merchant")) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-16 sm:pt-20">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        
        {/* Header - Version Mobile */}
        <div className="mb-6 sm:mb-8">
          {/* Mobile Header avec menu */}
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
                        {dashboardData?.merchant?.full_name?.charAt(0) || user?.full_name?.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{dashboardData?.merchant?.full_name || user?.full_name}</p>
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
          <div className="hidden md:flex md:flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                        {formatCurrency(dashboardData?.merchant?.availableBalance || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {dashboardData?.merchant?.full_name?.charAt(0) || user?.full_name?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Produits" value={stats.totalProducts} icon={Package} color="primary" />
          <StatCard label="Commandes" value={ordersStats.totalOrders} icon={ShoppingBag} color="blue-500" />
          <StatCard label="Chiffre d'affaires" value={formatCurrency(ordersStats.totalRevenue)} icon={TrendingUp} color="green-500" />
          <StatCard label="En attente" value={ordersStats.pendingOrders} icon={Clock} color="orange-500" />
        </div>

        {/* Tabs - Desktop */}
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

            {/* Contenu Desktop - garde ton code existant */}
            <TabsContent value="overview" className="space-y-6">
              {/* ... ton contenu overview existant ... */}
            </TabsContent>
            
            <TabsContent value="products" className="space-y-6">
              {/* ... ton contenu products existant ... */}
            </TabsContent>
            
            {/* ... autres tabs ... */}
          </Tabs>
        </div>

        {/* Version Mobile - Affichage direct du contenu sans tabs */}
        <div className="md:hidden">
          {/* Mobile Overview */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Commandes récentes */}
              <Card className="border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Commandes récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className="font-medium text-sm">{order.order_number}</span>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{order.customer_name}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8 text-sm">Aucune commande</p>
                  )}
                </CardContent>
              </Card>

              {/* Stats commandes simplifiées */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Total commandes</p>
                    <p className="text-2xl font-bold">{ordersStats.totalOrders}</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-lg">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">Articles vendus</p>
                    <p className="text-2xl font-bold">{ordersStats.totalItems}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Mobile Products */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
                <Button size="sm" onClick={() => setIsProductDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Liste produits mobile */}
              <div className="space-y-3">
                {filteredProducts.slice(0, 10).map((product) => (
                  <Card key={product.id} className="border-none shadow-lg">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400 m-2" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-sm">{formatCurrency(product.price)}</span>
                            <Badge variant="outline" className="text-xs">
                              Stock: {product.stock}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Aucun produit</p>
                )}
              </div>
            </div>
          )}

          {/* Mobile Orders */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {isLoadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto" />
                </div>
              ) : merchantOrders.length > 0 ? (
                merchantOrders.map((order) => (
                  <Card key={order.id} className="border-none shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold text-sm">{order.order_number}</span>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.items.length} article(s)</p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                        <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-none shadow-lg">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Aucune commande</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Mobile Categories */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              <Button size="sm" className="w-full" onClick={() => setIsCategoryDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />Ajouter une catégorie
              </Button>
              <div className="space-y-3">
                {merchantCategories.map((category) => (
                  <Card key={category.id} className="border-none shadow-lg">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/5 overflow-hidden flex-shrink-0">
                          {category.image_url ? (
                            <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <Tag className="h-6 w-6 text-primary/50 m-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.productCount || 0} produits</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingCategory(category)
                              setIsEditCategoryDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Coupons */}
          {activeTab === "coupons" && (
            <div className="space-y-4">
              <Button size="sm" className="w-full" onClick={() => setIsCouponDialogOpen(true)}>
                <Percent className="h-4 w-4 mr-2" />Créer un code promo
              </Button>
              <div className="space-y-3">
                {merchantCoupons.map((coupon) => (
                  <Card key={coupon.id} className="border-none shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono font-bold bg-gray-100 px-2 py-1 rounded">
                          {coupon.code}
                        </code>
                        <Badge variant="secondary" className="text-xs">
                          {coupon.type === "percentage" ? `${coupon.discount}%` : `${formatCurrency(coupon.discount)}`}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          {coupon.usedCount || 0} / {coupon.usageLimit || "∞"} utilisations
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-red-500"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
