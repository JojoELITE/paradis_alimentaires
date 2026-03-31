"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard, Truck, Check, MapPin, Phone, Mail, User, MessageCircle, Loader2, QrCode, Globe, Building2, Smartphone, Shield, Clock, Package, Award, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// --- Types ---
interface Country {
  name: string
  iso_code: string
  status: boolean
}

interface Operator {
  name: string
  code: string
  active: boolean
  provider: string
  country: {
    name: string
    iso_code: string
  }
}

// --- Modes de paiement ---
const paymentMethods = [
  { id: "card", name: "Carte bancaire", description: "Visa, Mastercard, etc.", icon: CreditCard },
  { id: "mobile", name: "Mobile Money", description: "Orange Money, MTN Mobile Money, etc.", icon: Smartphone },
  { id: "qr", name: "QR Code", description: "Payez par QR code", icon: QrCode },
]

// --- Modes de livraison ---
const deliveryMethods = [
  { id: "standard", name: "Standard", price: 2500, description: "Livraison en 3-5 jours ouvrables", icon: Clock, delay: "3-5 jours" },
  { id: "express", name: "Express", price: 5000, description: "Livraison en 1-2 jours ouvrables", icon: Truck, delay: "1-2 jours" },
]

// --- Composant CardInputs ---
function CardInputs({ countries }: { countries: Country[] }) {
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedOperator, setSelectedOperator] = useState<string>("")
  const [isLoadingOperators, setIsLoadingOperators] = useState(false)

  useEffect(() => {
    const fetchOperators = async () => {
      if (!selectedCountry) return
      
      setIsLoadingOperators(true)
      try {
        const response = await fetch(`http://localhost:3001/api/mypvit/operators/${selectedCountry}`)
        const data = await response.json()
        
        if (data.success && data.data.operators) {
          const activeOperators = data.data.operators.filter((op: Operator) => op.active === true)
          setOperators(activeOperators)
          setSelectedOperator("")
        } else {
          setOperators([])
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les opérateurs",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOperators(false)
      }
    }

    fetchOperators()
  }, [selectedCountry])

  return (
    <div className="mt-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Pays de la carte
        </Label>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="h-11 bg-white border-gray-200 hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Sélectionnez votre pays" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {countries.length > 0 ? (
              countries.map((country) => (
                <SelectItem key={country.iso_code} value={country.iso_code}>
                  <div className="flex items-center justify-between w-full">
                    <span>{country.name}</span>
                    <span className="text-xs text-muted-foreground">{country.iso_code}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-countries" disabled>
                Aucun pays disponible
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedCountry && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Opérateur / Banque
          </Label>
          {isLoadingOperators ? (
            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Chargement des opérateurs...</span>
            </div>
          ) : (
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger className="h-11 bg-white border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Sélectionnez votre opérateur" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {operators.length > 0 ? (
                  operators.map((operator) => (
                    <SelectItem key={operator.code} value={operator.code}>
                      <div className="flex flex-col py-1">
                        <span className="font-medium">{operator.name}</span>
                        <span className="text-xs text-muted-foreground">{operator.provider}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-operators" disabled>
                    Aucun opérateur disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Numéro de carte</Label>
          <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="h-11 bg-white border-gray-200 focus:border-primary" maxLength={19} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Date d'expiration</Label>
            <Input id="expiryDate" placeholder="MM/AA" className="h-11 bg-white" maxLength={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" placeholder="123" className="h-11 bg-white" type="password" maxLength={4} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardName">Nom sur la carte</Label>
          <Input id="cardName" placeholder="Nom sur la carte" className="h-11 bg-white" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <p className="text-xs text-blue-800">Transactions sécurisées</p>
        </div>
      </div>
    </div>
  )
}

// --- Composant MobileInputs ---
function MobileInputs() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedOperator, setSelectedOperator] = useState<string>("")
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [isLoadingOperators, setIsLoadingOperators] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/mypvit/countries")
        const data = await response.json()
        
        if (data.success && data.data) {
          setCountries(data.data.filter((country: Country) => country.status === true))
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des pays",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchOperators = async () => {
      if (!selectedCountry) return
      
      setIsLoadingOperators(true)
      try {
        const response = await fetch(`http://localhost:3001/api/mypvit/operators/${selectedCountry}`)
        const data = await response.json()
        
        if (data.success && data.data.operators) {
          const activeOperators = data.data.operators.filter((op: Operator) => op.active === true)
          setOperators(activeOperators)
          setSelectedOperator("")
        } else {
          setOperators([])
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les opérateurs",
          variant: "destructive",
        })
      } finally {
        setIsLoadingOperators(false)
      }
    }

    fetchOperators()
  }, [selectedCountry])

  return (
    <div className="mt-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Pays
        </Label>
        {isLoadingCountries ? (
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Chargement des pays...</span>
          </div>
        ) : (
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="h-11 bg-white border-gray-200 hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={country.iso_code} value={country.iso_code}>
                    <div className="flex items-center justify-between w-full">
                      <span>{country.name}</span>
                      <span className="text-xs text-muted-foreground">{country.iso_code}</span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-countries" disabled>
                  Aucun pays disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCountry && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            Opérateur Mobile Money
          </Label>
          {isLoadingOperators ? (
            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Chargement des opérateurs...</span>
            </div>
          ) : (
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger className="h-11 bg-white border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Sélectionnez votre opérateur" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {operators.length > 0 ? (
                  operators.map((operator) => (
                    <SelectItem key={operator.code} value={operator.code}>
                      <div className="flex flex-col py-1">
                        <span className="font-medium">{operator.name}</span>
                        <span className="text-xs text-muted-foreground">{operator.provider}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-operators" disabled>
                    Aucun opérateur disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="mobileNumber">Numéro de téléphone Mobile Money</Label>
        <Input id="mobileNumber" placeholder="Ex: 07X XXX XXX" className="h-11 bg-white" />
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" />
          Vous recevrez une demande de paiement sur votre téléphone
        </p>
      </div>

      {selectedOperator && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 animate-in fade-in duration-300">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-green-600 mt-0.5" />
            <p className="text-xs text-green-800">
              Paiement sécurisé via {operators.find(op => op.code === selectedOperator)?.provider || "GIMAC"}.
              Des frais de transaction peuvent s'appliquer selon votre opérateur.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Composant QRCodeModal ---
function QRCodeModal({ isOpen, onClose, qrCodeUrl, amount, orderNumber }: { 
  isOpen: boolean; 
  onClose: () => void; 
  qrCodeUrl: string | null;
  amount: number;
  orderNumber: string | null;
}) {
  const [isPolling, setIsPolling] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const checkPaymentStatus = () => {
    setIsPolling(true)
    setTimeout(() => {
      setPaymentConfirmed(true)
      setIsPolling(false)
    }, 5000)
  }

  if (paymentConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Paiement confirmé !</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-muted-foreground mb-2">
              Commande #{orderNumber} confirmée
            </p>
            <p className="text-sm text-muted-foreground">
              Vous recevrez un email de confirmation
            </p>
          </div>
          <Button onClick={onClose} className="w-full">
            Continuer
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Scanner le QR Code</DialogTitle>
          <DialogDescription className="text-center">
            Scannez ce code avec votre application Mobile Money
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          {qrCodeUrl ? (
            <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-primary/20">
              <img 
                src={qrCodeUrl} 
                alt="QR Code de paiement" 
                className="w-64 h-64 object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-xl">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          
          <div className="mt-6 w-full space-y-3 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Montant à payer</p>
              <p className="text-3xl font-bold text-primary">{amount.toLocaleString()} FCFA</p>
            </div>
            
            {!paymentConfirmed && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={checkPaymentStatus}
                disabled={isPolling}
              >
                {isPolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification en cours...
                  </>
                ) : (
                  "J'ai déjà payé"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Composant PaymentStatusModal ---
function PaymentStatusModal({ isOpen, onClose, status, message, transactionId, onSuccess, onRetry }: { 
  isOpen: boolean; 
  onClose: () => void; 
  status: 'pending' | 'success' | 'failed';
  message: string;
  transactionId: string | null;
  onSuccess: () => void;
  onRetry?: () => void;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [checkCount, setCheckCount] = useState(0)

  useEffect(() => {
    if (!isOpen || status !== 'pending') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const checkPayment = async () => {
      if (!transactionId) return
      
      try {
        const operatorCode = "airtel"
        const response = await fetch(
          `http://localhost:3001/api/mypvit/transaction/status?transactionId=${transactionId}&accountOperationCode=${operatorCode}&transactionOperation=PAYMENT`
        )
        const data = await response.json()
        
        if (data.success && data.data.is_success) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          onSuccess()
          onClose()
        } else if (checkCount >= 12) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = null
          setCheckCount(0)
        } else {
          setCheckCount(prev => prev + 1)
        }
      } catch (error) {
        console.error('Erreur vérification:', error)
      }
    }

    intervalRef.current = setInterval(checkPayment, 5000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isOpen, status, transactionId, checkCount, onSuccess, onClose])

  if (status === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Paiement confirmé !</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-muted-foreground mb-2">{message}</p>
          </div>
          <Button onClick={onClose} className="w-full">Continuer</Button>
        </DialogContent>
      </Dialog>
    )
  }

  if (status === 'failed') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-red-600">Paiement échoué</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X className="h-10 w-10 text-red-600" />
            </div>
            <p className="text-muted-foreground mb-2">{message}</p>
            <div className="flex gap-3 mt-6">
              <Button onClick={onClose} variant="outline" className="flex-1">Fermer</Button>
              {onRetry && (
                <Button onClick={() => { onRetry(); onClose(); }} className="flex-1">Réessayer</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Paiement en cours</DialogTitle>
          <DialogDescription className="text-center">
            Veuillez patienter pendant le traitement de votre paiement
          </DialogDescription>
        </DialogHeader>
        <div className="py-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{message}</p>
          <p className="text-xs text-muted-foreground mt-2">Vérification automatique...</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => {
              if (intervalRef.current) clearInterval(intervalRef.current)
              intervalRef.current = null
              onClose()
            }}
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Composant principal ---
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id)
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0].id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [orderId, setOrderId] = useState("")
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<{
    show: boolean;
    status: 'pending' | 'success' | 'failed';
    message: string;
    transactionId: string | null;
  }>({ show: false, status: 'pending', message: '', transactionId: null })

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })

  const selectedDelivery = deliveryMethods.find((d) => d.id === deliveryMethod) || deliveryMethods[0]
  const total = subtotal + selectedDelivery.price

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/mypvit/countries")
        const data = await response.json()
        
        if (data.success && data.data) {
          setCountries(data.data.filter((country: Country) => country.status === true))
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des pays",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!shippingInfo.fullName.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre nom complet", variant: "destructive" })
      return
    }
    if (!shippingInfo.email.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre email", variant: "destructive" })
      return
    }
    if (!shippingInfo.phone.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre numéro de téléphone", variant: "destructive" })
      return
    }
    if (!shippingInfo.address.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre adresse de livraison", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      // Récupérer l'ID utilisateur
      let userId: string | null = null
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          userId = userData.id
        }
      } catch (e) {
        console.error("Erreur parsing user:", e)
      }

      // Appel à l'API qui gère TOUT (création commande, paiement, vidage panier)
      const response = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          customerAccountNumber: shippingInfo.phone,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}`,
          billingAddress: `${shippingInfo.address}, ${shippingInfo.city}`,
          deliveryMethod: deliveryMethod,
          deliveryPrice: selectedDelivery.price,
          notes: shippingInfo.notes || null,
          customerName: shippingInfo.fullName,
          customerEmail: shippingInfo.email,
        }),
      })

      const orderData = await response.json()

      if (orderData.success) {
        setOrderNumber(orderData.data.orderNumber)
        setOrderId(orderData.data.orderNumber)

        // Vérifier le résultat du paiement
        if (orderData.data.payment && orderData.data.payment.success) {
          // Paiement réussi directement
          if (orderData.data.payment.status === 'success') {
            setIsComplete(true)
            clearCart()
            toast({
              title: "Commande confirmée !",
              description: `Votre commande #${orderData.data.orderNumber} a été payée avec succès.`,
            })
          } else {
            // Paiement en attente (Mobile Money)
            setPaymentStatus({
              show: true,
              status: 'pending',
              message: 'Paiement en cours de traitement...',
              transactionId: orderData.data.payment.reference_id
            })
          }
        } else if (paymentMethod === "qr") {
          // QR Code: générer et afficher
          const qrUrl = `http://localhost:3001/api/mypvit/qr-code/direct/generate?amount=${total}&payment_api_key_public=pk_1773325888803_dt8diavuh3h&payment_api_key_secret=sk_1773325888803_qt015a3cr5`
          setQrCodeUrl(qrUrl)
          setShowQRModal(true)
        } else {
          // Problème de paiement
          setPaymentStatus({
            show: true,
            status: 'failed',
            message: orderData.data.paymentError || 'Le paiement n\'a pas pu être initié',
            transactionId: null
          })
        }
        
        setIsSubmitting(false)
      } else {
        toast({
          title: "Erreur",
          description: orderData.message || "Une erreur est survenue",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de contacter le serveur",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = async () => {
    setIsComplete(true)
    clearCart()
    toast({
      title: "Commande confirmée !",
      description: `Votre commande #${orderNumber} a été payée avec succès.`,
    })
  }

  const handlePaymentRetry = () => {
    // Re-soumettre la commande
    handleSubmit(new Event('submit') as any)
  }

  const handlePaymentClose = () => {
    setPaymentStatus({ show: false, status: 'pending', message: '', transactionId: null })
  }

  const handleQRCodeClose = () => {
    setShowQRModal(false)
    setIsComplete(true)
    clearCart()
    toast({
      title: "Commande confirmée !",
      description: `Votre commande #${orderNumber} a été créée avec succès.`,
    })
  }

  if (isComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container max-w-md mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Commande confirmée !
          </h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre commande. Vous recevrez un email de confirmation.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <p className="text-sm text-muted-foreground mb-2">Numéro de commande</p>
            <p className="text-xl font-bold text-primary font-mono">{orderNumber}</p>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <Button size="lg" className="w-full">Retour à l'accueil</Button>
            </Link>
            <Link href="/commandes">
              <Button variant="outline" size="lg" className="w-full">Voir mes commandes</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <Link href="/panier" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors group">
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Retour au panier
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Finaliser la commande
          </h1>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>1. Livraison</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span>2. Paiement</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <span>3. Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations de livraison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Informations de livraison</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nom complet</Label>
                      <Input name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Jean Dupont" className="h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <Input name="email" type="email" value={shippingInfo.email} onChange={handleInputChange} placeholder="jean@example.com" className="h-11" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Téléphone</Label>
                    <Input name="phone" value={shippingInfo.phone} onChange={handleInputChange} placeholder="+225 07 XX XX XX XX" className="h-11" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Adresse de livraison</Label>
                    <Input name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="Rue des Jardins, Cocody" className="h-11" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ville</Label>
                    <Input name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="Abidjan" className="h-11" required />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Notes (optionnel)</Label>
                    <Textarea name="notes" value={shippingInfo.notes} onChange={handleInputChange} placeholder="Instructions de livraison..." rows={3} />
                  </div>
                </div>
              </div>

              {/* Mode de livraison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Mode de livraison</h2>
                  </div>
                </div>
                <div className="p-6">
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deliveryMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <div
                            key={method.id}
                            className={cn(
                              "relative flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition-all",
                              deliveryMethod === method.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-gray-200 hover:border-primary/50"
                            )}
                            onClick={() => setDeliveryMethod(method.id)}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={method.id} id={`delivery-${method.id}`} />
                              <div>
                                <Label htmlFor={`delivery-${method.id}`} className="font-semibold cursor-pointer">
                                  {method.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">{method.description}</p>
                                <p className="text-xs text-primary mt-1">Livraison en {method.delay}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{method.price.toLocaleString()} FCFA</p>
                              <Icon className="h-4 w-4 text-muted-foreground mt-1" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Méthode de paiement</h2>
                  </div>
                </div>
                <div className="p-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <div
                            key={method.id}
                            className={cn(
                              "flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all",
                              paymentMethod === method.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-gray-200 hover:border-primary/50"
                            )}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                            <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1">
                              <Label htmlFor={`payment-${method.id}`} className="font-semibold cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    isLoadingCountries ? (
                      <div className="mt-6 flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-sm">Chargement des pays...</span>
                      </div>
                    ) : (
                      <CardInputs countries={countries} />
                    )
                  )}
                  {paymentMethod === "mobile" && <MobileInputs />}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Traitement en cours...
                  </span>
                ) : (
                  `Payer ${total.toLocaleString()} FCFA`
                )}
              </Button>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-lg font-semibold">Récapitulatif</h2>
                  <p className="text-sm text-muted-foreground mt-1">{items.length} article(s)</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="h-14 w-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} width={56} height={56} className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livraison ({selectedDelivery.name})</span>
                      <span className="font-medium text-green-600">+{selectedDelivery.price.toLocaleString()} FCFA</span>
                    </div>
                    <div className="border-t pt-3 mt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary text-xl">{total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Paiement 100% sécurisé<br />
                      Livraison suivie en temps réel
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold mb-4">Besoin d'aide ?</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/contact" className="text-primary hover:underline inline-flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Contactez-nous
                    </Link>
                  </li>
                  <li>
                    <Link href="/livraison" className="text-primary hover:underline inline-flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Politique de livraison
                    </Link>
                  </li>
                  <li>
                    <Link href="/retours" className="text-primary hover:underline inline-flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      Politique de retours
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal isOpen={showQRModal} onClose={handleQRCodeClose} qrCodeUrl={qrCodeUrl} amount={total} orderNumber={orderNumber} />
      
      <PaymentStatusModal 
        isOpen={paymentStatus.show}
        onClose={handlePaymentClose}
        status={paymentStatus.status}
        message={paymentStatus.message}
        transactionId={paymentStatus.transactionId}
        onSuccess={handlePaymentSuccess}
        onRetry={handlePaymentRetry}
      />
    </main>
  )
}