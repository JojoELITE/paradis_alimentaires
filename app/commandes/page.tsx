"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Download,
  Calendar,
  MapPin,
  CreditCard,
  Receipt,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"

interface OrderItem {
  id: number
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  category: string
  subtotal?: number
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: OrderItem[]
  shippingAddress: string
  paymentMethod: string
  trackingNumber?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Récupérer les commandes depuis l'API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:3333/api/orders/${user.id}`)
        const data = await response.json()

        if (data.success) {
          // Transformer les données pour le format attendu
          const formattedOrders = data.data.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.createdAt,
            status: order.status,
            total: order.total,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            trackingNumber: order.trackingNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            items: order.items?.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
              image: item.image || "/placeholder.svg",
              category: item.category || "Produit",
              subtotal: item.subtotal
            })) || []
          }))
          setOrders(formattedOrders)
        } else {
          toast({
            title: "Erreur",
            description: data.message || "Impossible de charger les commandes",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erreur:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger vos commandes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Annuler une commande
  const handleCancelOrder = async (orderId: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`http://localhost:3333/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Commande annulée",
          description: "Votre commande a été annulée avec succès.",
        })
        // Recharger les commandes
        const refreshResponse = await fetch(`http://localhost:3333/api/orders/${user.id}`)
        const refreshData = await refreshResponse.json()
        if (refreshData.success) {
          const formattedOrders = refreshData.data.map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.createdAt,
            status: order.status,
            total: order.total,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            trackingNumber: order.trackingNumber,
            items: order.items?.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
              image: item.image || "/placeholder.svg",
              category: item.category || "Produit",
            })) || []
          }))
          setOrders(formattedOrders)
        }
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible d'annuler la commande",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la commande",
        variant: "destructive",
      })
    }
  }

  // Télécharger la facture
  const handleDownloadInvoice = async (orderId: string) => {
    if (!user?.id) return

    try {
      const response = await fetch(`http://localhost:3333/api/orders/${orderId}/invoice/${user.id}`)
      const data = await response.json()

      if (data.success) {
        // Créer un fichier JSON à télécharger
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `facture_${orderId}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast({
          title: "Facture téléchargée",
          description: "La facture a été téléchargée avec succès.",
        })
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible de télécharger la facture",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    const config = {
      pending: { label: "En attente", color: "bg-yellow-500/10 text-yellow-600", icon: Clock },
      processing: { label: "En traitement", color: "bg-blue-500/10 text-blue-600", icon: RefreshCw },
      shipped: { label: "Expédiée", color: "bg-purple-500/10 text-purple-600", icon: Truck },
      delivered: { label: "Livrée", color: "bg-green-500/10 text-green-600", icon: CheckCircle2 },
      cancelled: { label: "Annulée", color: "bg-red-500/10 text-red-600", icon: XCircle },
    }
    const { label, color, icon: Icon } = config[status]
    return (
      <Badge className={`${color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusProgress = (status: Order["status"]) => {
    const steps = ["pending", "processing", "shipped", "delivered"]
    const currentIndex = steps.indexOf(status)
    if (status === "cancelled") return 0
    return ((currentIndex + 1) / steps.length) * 100
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos commandes...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connectez-vous</h2>
            <p className="text-muted-foreground mb-4">
              Veuillez vous connecter pour voir vos commandes.
            </p>
            <Link href="/connexion">
              <Button>Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Mes commandes
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivez et gérez toutes vos commandes en un seul endroit
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro de commande..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processing">En traitement</SelectItem>
              <SelectItem value="shipped">Expédiées</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Aucune commande ne correspond à vos critères."
                  : "Vous n'avez pas encore passé de commande."}
              </p>
              <Link href="/produits">
                <Button className="bg-primary hover:bg-primary/90">
                  Découvrir nos produits
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        <span className="font-mono font-semibold text-lg">{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{order.items.length} article(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{formatCurrency(order.total)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailsOpen(true)
                        }}
                      >
                        Voir les détails
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== "cancelled" && (
                    <div className="mb-4">
                      <Progress value={getStatusProgress(order.status)} className="h-2" />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>En attente</span>
                        <span>En traitement</span>
                        <span>Expédiée</span>
                        <span>Livrée</span>
                      </div>
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                        <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 bg-gray-100 rounded-lg">
                        <span className="text-sm font-medium">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    {order.status === "pending" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Annuler la commande
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadInvoice(order.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Facture
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsDetailsOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Commande {selectedOrder.orderNumber}</DialogTitle>
                <DialogDescription>
                  Passée le {formatDate(selectedOrder.date)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedOrder.status)}
                    {selectedOrder.trackingNumber && (
                      <Badge variant="outline" className="text-xs">
                        Suivi: {selectedOrder.trackingNumber}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-semibold mb-3">Articles</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            </div>
                            <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                            <span>Quantité: {item.quantity}</span>
                            <span>{formatCurrency(item.price)} / unité</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">Livraison</h4>
                    </div>
                    <p className="text-sm">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <h4 className="font-semibold">Paiement</h4>
                    </div>
                    <p className="text-sm">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                  <Separator className="mb-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                    Fermer
                  </Button>
                  {selectedOrder.status === "pending" && (
                    <Button 
                      variant="outline" 
                      className="text-red-600"
                      onClick={() => {
                        handleCancelOrder(selectedOrder.id)
                        setIsDetailsOpen(false)
                      }}
                    >
                      Annuler la commande
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => handleDownloadInvoice(selectedOrder.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger la facture
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}