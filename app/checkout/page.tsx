"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft, CreditCard, Truck, Check, MapPin, Phone, Mail, User,
  MessageCircle, Loader2, QrCode, Globe, Building2, Smartphone, Shield,
  Clock, Package, Award, X, Store
} from "lucide-react"
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

interface KYCData {
  operator: string | null
  full_name: string | null
  detected_operator?: string
}

// --- Constantes ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ecomerce-api-aotc.onrender.com"
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || "https://apist.onrender.com"

const paymentMethods = [
  { id: "card", name: "Carte bancaire", description: "Visa, Mastercard, etc.", icon: CreditCard },
  { id: "mobile", name: "Mobile Money", description: "Orange Money, MTN Mobile Money, etc.", icon: Smartphone },
  { id: "qr", name: "QR Code", description: "Payez par QR code", icon: QrCode },
]

const deliveryMethods = [
  { id: "pickup", name: "Retrait en magasin", price: 0, description: "Retirez votre commande gratuitement en magasin", icon: Store, delay: "Retrait immédiat" },
  { id: "standard", name: "Livraison Standard", price: 2500, description: "Livraison à domicile en 3-5 jours", icon: Truck, delay: "3-5 jours" },
  { id: "express", name: "Livraison Express", price: 5000, description: "Livraison à domicile en 1-2 jours", icon: Clock, delay: "1-2 jours" },
]

// --- Composant CardInputs ---
function CardInputs({ countries }: { countries: Country[] }) {
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedOperator, setSelectedOperator] = useState<string>("")
  const [isLoadingOperators, setIsLoadingOperators] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

  useEffect(() => {
    const fetchOperators = async () => {
      if (!selectedCountry) {
        setOperators([])
        return
      }
      setIsLoadingOperators(true)
      try {
        const response = await fetch(`${PAYMENT_API_URL}/api/mypvit/operators/${selectedCountry}`)
        const data = await response.json()
        if (data.success && data.data?.operators) {
          const activeOperators = data.data.operators.filter((op: Operator) => op.active === true)
          setOperators(activeOperators)
          setSelectedOperator("")
        } else {
          setOperators([])
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error)
        toast({ title: "Erreur", description: "Impossible de charger les opérateurs", variant: "destructive" })
      } finally {
        setIsLoadingOperators(false)
      }
    }
    fetchOperators()
  }, [selectedCountry])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
    }
    return v
  }

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
              <SelectItem value="no-countries" disabled>Aucun pays disponible</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedCountry && operators.length > 0 && (
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
                {operators.map((operator) => (
                  <SelectItem key={operator.code} value={operator.code}>
                    <div className="flex flex-col py-1">
                      <span className="font-medium">{operator.name}</span>
                      <span className="text-xs text-muted-foreground">{operator.provider}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Numéro de carte</Label>
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="h-11 bg-white border-gray-200 focus:border-primary"
            maxLength={19}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Date d'expiration</Label>
            <Input
              id="expiryDate"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/AA"
              className="h-11 bg-white"
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="123"
              className="h-11 bg-white"
              type="password"
              maxLength={4}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardName">Nom sur la carte</Label>
          <Input
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            placeholder="Nom sur la carte"
            className="h-11 bg-white"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <p className="text-xs text-blue-800">Transactions sécurisées par chiffrement SSL</p>
        </div>
      </div>
    </div>
  )
}

// --- Composant MobileInputs (CONSOLIDÉ) ---
// Gère pays + opérateur + numéro + KYC en un seul bloc.
// Remonte au parent : phone, operatorCode, operatorName, fullName via callbacks.
function MobileInputs({ onPhoneChange, onOperatorDetected, onOperatorChange }: {
  onPhoneChange?: (phone: string) => void
  onOperatorDetected?: (operator: string | null, fullName: string | null) => void
  onOperatorChange?: (operatorCode: string | null, operatorName: string | null) => void
}) {
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [operators, setOperators] = useState<Operator[]>([])
  const [selectedOperator, setSelectedOperator] = useState<string>("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [isLoadingOperators, setIsLoadingOperators] = useState(false)
  const [isCheckingKYC, setIsCheckingKYC] = useState(false)
  const [kycData, setKycData] = useState<KYCData | null>(null)

  // Chargement des pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${PAYMENT_API_URL}/api/mypvit/countries`)
        const data = await response.json()
        if (data.success && data.data) {
          setCountries(data.data.filter((country: Country) => country.status === true))
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error)
        toast({ title: "Erreur", description: "Impossible de charger la liste des pays", variant: "destructive" })
      } finally {
        setIsLoadingCountries(false)
      }
    }
    fetchCountries()
  }, [])

  // Chargement des opérateurs selon le pays
  useEffect(() => {
    const fetchOperators = async () => {
      if (!selectedCountry) {
        setOperators([])
        setSelectedOperator("")
        onOperatorChange?.(null, null)
        return
      }
      setIsLoadingOperators(true)
      try {
        const response = await fetch(`${PAYMENT_API_URL}/api/mypvit/operators/${selectedCountry}`)
        const data = await response.json()
        if (data.success && data.data?.operators) {
          const activeOperators = data.data.operators.filter((op: Operator) => op.active === true)
          setOperators(activeOperators)
          setSelectedOperator("")
          onOperatorChange?.(null, null)
        } else {
          setOperators([])
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error)
        toast({ title: "Erreur", description: "Impossible de charger les opérateurs", variant: "destructive" })
      } finally {
        setIsLoadingOperators(false)
      }
    }
    fetchOperators()
  }, [selectedCountry])

  // Vérification KYC sur le numéro
  useEffect(() => {
    const checkKYC = async () => {
      const phone = mobileNumber.trim()
      onPhoneChange?.(phone)
      if (!phone || phone.replace(/\s/g, '').length < 9) {
        setKycData(null)
        onOperatorDetected?.(null, null)
        return
      }
      setIsCheckingKYC(true)
      try {
        const response = await fetch(
          `${PAYMENT_API_URL}/api/mypvit/kyc/marchant?customerAccountNumber=${encodeURIComponent(phone)}`
        )
        const data = await response.json()
        if (data.success && data.data) {
          const operatorName = data.data.detected_operator || data.data.operator || null
          setKycData({
            operator: operatorName,
            full_name: data.data.full_name || null,
            detected_operator: data.data.detected_operator
          })
          onOperatorDetected?.(operatorName, data.data.full_name || null)
        } else {
          setKycData(null)
          onOperatorDetected?.(null, null)
        }
      } catch (error) {
        console.error("Erreur KYC:", error)
        setKycData(null)
        onOperatorDetected?.(null, null)
      } finally {
        setIsCheckingKYC(false)
      }
    }

    const timeoutId = setTimeout(checkKYC, 500)
    return () => clearTimeout(timeoutId)
  }, [mobileNumber])

  const handleOperatorSelect = (code: string) => {
    setSelectedOperator(code)
    const found = operators.find(op => op.code === code)
    onOperatorChange?.(code || null, found?.name || null)
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)}`
  }

  return (
    <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
      {/* Pays */}
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
                <SelectItem value="no-countries" disabled>Aucun pays disponible</SelectItem>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Opérateur — affiché seulement après sélection du pays */}
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
          ) : operators.length > 0 ? (
            <Select value={selectedOperator} onValueChange={handleOperatorSelect}>
              <SelectTrigger className="h-11 bg-white border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Sélectionnez votre opérateur" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {operators.map((operator) => (
                  <SelectItem key={operator.code} value={operator.code}>
                    <div className="flex flex-col py-1">
                      <span className="font-medium">{operator.name}</span>
                      <span className="text-xs text-muted-foreground">{operator.provider}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg bg-gray-50">
              Aucun opérateur disponible pour ce pays
            </div>
          )}
        </div>
      )}

      {/* Numéro de téléphone — toujours visible */}
      <div className="space-y-2">
        <Label htmlFor="mobileNumber">Numéro de téléphone Mobile Money</Label>
        <Input
          id="mobileNumber"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(formatPhoneNumber(e.target.value))}
          placeholder="07 XX XXX XXX"
          className="h-11 bg-white"
        />
        {isCheckingKYC && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Vérification du numéro...
          </p>
        )}
        {kycData?.operator && (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Opérateur détecté : {kycData.operator}
            {kycData.full_name && ` — ${kycData.full_name}`}
          </p>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" />
          Vous recevrez une demande de paiement sur votre téléphone
        </p>
      </div>

      {/* Badge récapitulatif opérateur sélectionné */}
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
function QRCodeModal({ isOpen, onClose, qrCodeUrl, amount, orderNumber, orderId, onPaymentSuccess }: {
  isOpen: boolean
  onClose: () => void
  qrCodeUrl: string | null
  amount: number
  orderNumber: string | null
  orderId: string | null
  onPaymentSuccess: () => void
}) {
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isOpen) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
      setPaymentConfirmed(false)
      return
    }
    intervalRef.current = setInterval(async () => {
      if (!orderId) return
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`)
        const data = await response.json()
        if (data.success && data.data?.is_paid) {
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
          setPaymentConfirmed(true)
          setTimeout(() => { onPaymentSuccess(); onClose() }, 2000)
        }
      } catch (error) {
        console.error('Erreur vérification paiement:', error)
      }
    }, 5000)
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }
  }, [isOpen, orderId, onPaymentSuccess, onClose])

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
            <p className="text-muted-foreground mb-2">Commande #{orderNumber} confirmée</p>
            <p className="text-sm text-muted-foreground">Vous recevrez un email de confirmation</p>
          </div>
          <Button onClick={onClose} className="w-full">Continuer</Button>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeUrl} alt="QR Code de paiement" className="w-64 h-64 object-contain" />
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
            <p className="text-xs text-muted-foreground">Vérification automatique du paiement en cours...</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Composant PaymentStatusModal ---
function PaymentStatusModal({ isOpen, onClose, status, message, transactionId, orderId, onSuccess, onRetry }: {
  isOpen: boolean
  onClose: () => void
  status: 'pending' | 'success' | 'failed'
  message: string
  transactionId: string | null
  orderId: string | null
  onSuccess: () => void
  onRetry?: () => void
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [checkCount, setCheckCount] = useState(0)
  const [localStatus, setLocalStatus] = useState<'pending' | 'success' | 'failed'>(status)
  const [localMessage, setLocalMessage] = useState(message)

  useEffect(() => { setLocalStatus(status); setLocalMessage(message) }, [status, message])

  useEffect(() => {
    if (!isOpen || localStatus !== 'pending') {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
      return
    }

    const checkPayment = async () => {
      try {
        if (orderId) {
          const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment-status`)
          const data = await response.json()
          if (data.success && data.data?.is_paid) {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
            setLocalStatus('success')
            setLocalMessage('Paiement confirmé avec succès!')
            setTimeout(() => { onSuccess(); onClose() }, 1500)
            return
          }
        }

        if (transactionId) {
          const operatorCode = "airtel"
          const directResponse = await fetch(
            `${PAYMENT_API_URL}/api/mypvit/transaction/status?transactionId=${transactionId}&accountOperationCode=${operatorCode}&transactionOperation=PAYMENT`
          )
          const directData = await directResponse.json()
          if (directData.success && directData.data?.is_success) {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
            setLocalStatus('success')
            setLocalMessage('Paiement confirmé avec succès!')
            setTimeout(() => { onSuccess(); onClose() }, 1500)
            return
          }
        }

        setCheckCount(prev => prev + 1)
        if (checkCount >= 12) {
          if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
          setLocalStatus('failed')
          setLocalMessage('Le délai de vérification a expiré. Veuillez vérifier le statut de votre commande plus tard.')
        }
      } catch (error) {
        console.error('Erreur vérification:', error)
        setCheckCount(prev => prev + 1)
      }
    }

    checkPayment()
    intervalRef.current = setInterval(checkPayment, 5000)
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }
  }, [isOpen, localStatus, transactionId, orderId, checkCount, onSuccess, onClose])

  if (localStatus === 'success') {
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
            <p className="text-muted-foreground mb-2">{localMessage}</p>
          </div>
          <Button onClick={onClose} className="w-full">Continuer</Button>
        </DialogContent>
      </Dialog>
    )
  }

  if (localStatus === 'failed') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-yellow-600">Paiement en attente</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <p className="text-muted-foreground mb-2">{localMessage}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Vous pouvez vérifier le statut de votre commande dans votre espace client.
            </p>
            <div className="flex gap-3 mt-6">
              <Button onClick={onClose} variant="outline" className="flex-1">Fermer</Button>
              {onRetry && (
                <Button onClick={() => { onRetry(); onClose() }} className="flex-1">Réessayer</Button>
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
          <p className="text-muted-foreground">{localMessage}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Vérification automatique... ({Math.floor(checkCount * 5)}s)
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
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

  // ✅ État centralisé pour le Mobile Money (opérateur + numéro)
  const [mobilePhone, setMobilePhone] = useState<string>("")
  const [mobileOperatorCode, setMobileOperatorCode] = useState<string | null>(null)
  const [mobileOperatorName, setMobileOperatorName] = useState<string | null>(null)
  const [detectedFullName, setDetectedFullName] = useState<string | null>(null)

  const [paymentStatus, setPaymentStatus] = useState<{
    show: boolean
    status: 'pending' | 'success' | 'failed'
    message: string
    transactionId: string | null
    orderId: string | null
  }>({ show: false, status: 'pending', message: '', transactionId: null, orderId: null })

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
  const isDeliverySelected = deliveryMethod !== "pickup"

  // Chargement des pays pour le paiement par carte
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${PAYMENT_API_URL}/api/mypvit/countries`)
        const data = await response.json()
        if (data.success && data.data) {
          setCountries(data.data.filter((country: Country) => country.status === true))
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error)
        toast({ title: "Erreur", description: "Impossible de charger la liste des pays", variant: "destructive" })
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

  // ✅ Callbacks remontés depuis MobileInputs
  const handleMobilePhoneChange = (phone: string) => {
    setMobilePhone(phone)
    // Sync aussi dans shippingInfo pour la validation
    setShippingInfo(prev => ({ ...prev, phone }))
  }

  const handleMobileOperatorChange = (operatorCode: string | null, operatorName: string | null) => {
    setMobileOperatorCode(operatorCode)
    setMobileOperatorName(operatorName)
  }

  const handleMobileOperatorDetected = (operator: string | null, fullName: string | null) => {
    setDetectedFullName(fullName)
    // Si le nom n'est pas encore rempli, on le pré-remplit avec le nom KYC
    if (fullName && !shippingInfo.fullName) {
      setShippingInfo(prev => ({ ...prev, fullName }))
    }
  }

  const handlePaymentSuccess = () => {
    setIsComplete(true)
    clearCart()
    toast({ title: "Commande confirmée !", description: `Votre commande #${orderNumber} a été payée avec succès.` })
  }

  const handlePaymentRetry = () => {
    handleSubmit(new Event('submit') as any)
  }

  const handleQRPaymentSuccess = () => {
    setIsComplete(true)
    clearCart()
    toast({ title: "Commande confirmée !", description: `Votre commande #${orderNumber} a été payée avec succès.` })
  }

  const validateForm = () => {
    if (!shippingInfo.fullName.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre nom complet", variant: "destructive" })
      return false
    }
    if (!shippingInfo.email.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre email", variant: "destructive" })
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      toast({ title: "Email invalide", description: "Veuillez saisir un email valide", variant: "destructive" })
      return false
    }
    // Pour Mobile Money, on valide le numéro mobile ; sinon le champ phone standard
    if (paymentMethod === "mobile") {
      if (!mobilePhone || mobilePhone.replace(/\s/g, '').length < 9) {
        toast({ title: "Champ requis", description: "Veuillez saisir votre numéro Mobile Money", variant: "destructive" })
        return false
      }
    } else {
      if (!shippingInfo.phone.trim()) {
        toast({ title: "Champ requis", description: "Veuillez saisir votre numéro de téléphone", variant: "destructive" })
        return false
      }
    }
    if (isDeliverySelected && !shippingInfo.address.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre adresse de livraison", variant: "destructive" })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
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

      const deliveryAddress = isDeliverySelected
        ? `${shippingInfo.address}, ${shippingInfo.city}`
        : "Retrait en magasin"

      // ✅ Le numéro de téléphone envoyé à l'API dépend du mode de paiement
      const customerPhone = paymentMethod === "mobile" ? mobilePhone : shippingInfo.phone

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          customerAccountNumber: customerPhone,
          // ✅ Opérateur Mobile Money envoyé à l'API (null pour les autres méthodes)
          mobileOperatorCode: paymentMethod === "mobile" ? mobileOperatorCode : null,
          mobileOperatorName: paymentMethod === "mobile" ? mobileOperatorName : null,
          shippingAddress: deliveryAddress,
          billingAddress: deliveryAddress,
          deliveryMethod,
          deliveryPrice: selectedDelivery.price,
          notes: shippingInfo.notes || null,
          customerName: shippingInfo.fullName,
          customerEmail: shippingInfo.email,
          paymentMethod,
          totalAmount: total
        }),
      })

      const orderData = await response.json()

      if (orderData.success) {
        const newOrderNumber = orderData.data.orderNumber || orderData.data.id
        setOrderNumber(newOrderNumber)
        setOrderId(newOrderNumber)

        if (orderData.data.payment && orderData.data.payment.success) {
          if (orderData.data.payment.status === 'success') {
            setIsComplete(true)
            clearCart()
            toast({ title: "Commande confirmée !", description: `Votre commande #${newOrderNumber} a été payée avec succès.` })
          } else {
            setPaymentStatus({
              show: true,
              status: 'pending',
              message: orderData.data.payment.message || 'Paiement en cours de traitement...',
              transactionId: orderData.data.payment.reference_id || null,
              orderId: newOrderNumber
            })
          }
        } else if (paymentMethod === "qr") {
          const qrUrl = `${PAYMENT_API_URL}/api/mypvit/qr-code/direct/generate?amount=${total}&payment_api_key_public=${process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY}&payment_api_key_secret=${process.env.NEXT_PUBLIC_PAYMENT_SECRET_KEY}`
          setQrCodeUrl(qrUrl)
          setShowQRModal(true)
        } else if (paymentMethod === "mobile") {
          setPaymentStatus({
            show: true,
            status: 'pending',
            message: `En attente de confirmation du paiement via ${mobileOperatorName || "Mobile Money"}...`,
            transactionId: orderData.data.payment?.reference_id || null,
            orderId: newOrderNumber
          })
        } else {
          setPaymentStatus({
            show: true,
            status: 'pending',
            message: 'Paiement en attente de validation...',
            transactionId: null,
            orderId: newOrderNumber
          })
        }
      } else {
        toast({
          title: "Erreur",
          description: orderData.message || "Une erreur est survenue lors de la création de la commande",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({ title: "Erreur", description: "Impossible de contacter le serveur. Veuillez réessayer.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
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
            {deliveryMethod === "pickup" && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <Store className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Retrait en magasin</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vous pouvez retirer votre commande dès maintenant dans notre boutique
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Link href="/"><Button size="lg" className="w-full">Retour à l'accueil</Button></Link>
            <Link href="/commandes"><Button variant="outline" size="lg" className="w-full">Voir mes commandes</Button></Link>
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

              {/* Informations personnelles */}
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
                      <Input
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        placeholder="jean@example.com"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* ✅ Téléphone : simple si pas Mobile Money, sinon MobileInputs */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Téléphone</Label>
                    {paymentMethod === "mobile" ? (
                      // En mode Mobile Money, MobileInputs gère pays + opérateur + numéro
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700 flex items-center gap-2">
                        <Smartphone className="h-4 w-4 flex-shrink-0" />
                        Le numéro Mobile Money saisi ci-dessous sera utilisé comme téléphone de contact.
                      </div>
                    ) : (
                      <Input
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        placeholder="07 XX XX XX XX"
                        className="h-11"
                        required
                      />
                    )}
                  </div>

                  {isDeliverySelected && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Adresse de livraison</Label>
                        <Input
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          placeholder="Rue des Jardins, Cocody"
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Ville</Label>
                        <Input
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          placeholder="Abidjan"
                          className="h-11"
                          required
                        />
                      </div>
                    </>
                  )}

                  {!isDeliverySelected && (
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <Store className="h-5 w-5 text-primary mb-2" />
                      <p className="text-sm font-medium text-primary">Retrait en magasin</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vous pourrez retirer votre commande gratuitement dans notre boutique aux heures d'ouverture.
                      </p>
                      <p className="text-xs font-medium mt-2">📍 Adresse du magasin :</p>
                      <p className="text-xs text-muted-foreground">Abidjan, Cocody, Rue des Jardins</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Notes (optionnel)</Label>
                    <Textarea
                      name="notes"
                      value={shippingInfo.notes}
                      onChange={handleInputChange}
                      placeholder={isDeliverySelected ? "Instructions de livraison..." : "Informations supplémentaires..."}
                      rows={3}
                    />
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <p className="text-xs text-primary mt-1">{method.delay}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {method.price === 0 ? (
                                <p className="text-sm font-bold text-green-600">GRATUIT</p>
                              ) : (
                                <p className="text-lg font-bold text-primary">{method.price.toLocaleString()} FCFA</p>
                              )}
                              <Icon className="h-4 w-4 text-muted-foreground mt-1" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Méthode de paiement */}
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

                  {/* ✅ Carte bancaire */}
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

                  {/* ✅ Mobile Money — instance UNIQUE, remonte tout au parent */}
                  {paymentMethod === "mobile" && (
                    <div className="mt-6">
                      <MobileInputs
                        onPhoneChange={handleMobilePhoneChange}
                        onOperatorChange={handleMobileOperatorChange}
                        onOperatorDetected={handleMobileOperatorDetected}
                      />
                    </div>
                  )}

                  {/* QR Code */}
                  {paymentMethod === "qr" && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <QrCode className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Paiement par QR Code</p>
                          <p className="text-sm text-blue-700">
                            Après validation, un QR code vous sera présenté à scanner avec votre application Mobile Money.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                      <span className="text-muted-foreground">
                        {selectedDelivery.name === "Retrait en magasin" ? "Frais de retrait" : "Livraison"}
                      </span>
                      {selectedDelivery.price === 0 ? (
                        <span className="font-medium text-green-600">Gratuit</span>
                      ) : (
                        <span className="font-medium">+{selectedDelivery.price.toLocaleString()} FCFA</span>
                      )}
                    </div>
                    <div className="border-t pt-3 mt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary text-xl">{total.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Récap opérateur Mobile Money dans le sidebar */}
                  {paymentMethod === "mobile" && mobileOperatorName && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-xs text-green-800 flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Paiement via <strong>{mobileOperatorName}</strong>
                      {mobilePhone && <> — {mobilePhone}</>}
                    </div>
                  )}

                  <div className="bg-primary/5 rounded-lg p-4 text-center">
                    <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Paiement 100% sécurisé<br />
                      {selectedDelivery.name === "Retrait en magasin" ? "Retrait gratuit en boutique" : "Livraison suivie en temps réel"}
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

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        qrCodeUrl={qrCodeUrl}
        amount={total}
        orderNumber={orderNumber}
        orderId={orderId}
        onPaymentSuccess={handleQRPaymentSuccess}
      />

      <PaymentStatusModal
        isOpen={paymentStatus.show}
        onClose={() => setPaymentStatus({ show: false, status: 'pending', message: '', transactionId: null, orderId: null })}
        status={paymentStatus.status}
        message={paymentStatus.message}
        transactionId={paymentStatus.transactionId}
        orderId={paymentStatus.orderId}
        onSuccess={handlePaymentSuccess}
        onRetry={handlePaymentRetry}
      />
    </main>
  )
}
