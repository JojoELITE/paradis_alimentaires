"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, Truck, Check, MapPin, Phone, Mail, User, MessageCircle, Loader2, QrCode, Globe, Building2, Smartphone, Shield, Clock, Package, Award, X, Store, ArrowDownLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// --- Types ---
interface Country {
  name: string;
  iso_code: string;
  status: boolean;
}

interface Operator {
  name: string;
  code: string;
  active: boolean;
  provider: string;
  country: {
    name: string;
    iso_code: string;
  };
}

interface CustomerInfo {
  fullName: string;
  customerAccountNumber: string;
  isActive: boolean;
  operator?: string;
  account_code?: string;
}

// --- Constantes ---
const MY_PAYVIT_SECRET_STORAGE_KEY = "mypayvit_secret";
const GIMAC_ACCOUNT_CODE = "ACC_69A1BAB0D747B";

// --- Fonctions utilitaires ---
const persistSecretKey = (
  accountCode: string,
  secretKey: string,
  operatorLabel?: string,
  expiresIn?: number
) => {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(MY_PAYVIT_SECRET_STORAGE_KEY);
  const parsed = existing ? JSON.parse(existing) : {};

  const entry = {
    secret: secretKey,
    operationAccountCode: accountCode,
    expires_in: expiresIn ?? 3600,
    timestamp: Date.now(),
  };

  parsed[accountCode] = entry;

  const label = operatorLabel?.toLowerCase() || "";
  if (label.includes("airtel")) {
    parsed.airtel = entry;
  } else if (label.includes("moov")) {
    parsed.moov = entry;
  } else if (label.includes("gimac")) {
    parsed.gimac = entry;
  } else if (accountCode.includes("GIMAC")) {
    parsed.gimac = entry;
  }

  localStorage.setItem(MY_PAYVIT_SECRET_STORAGE_KEY, JSON.stringify(parsed));
};

const getSecretKeyForAccount = (accountCode?: string): string | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(MY_PAYVIT_SECRET_STORAGE_KEY);
  if (!stored) return null;

  const parsed = JSON.parse(stored);
  if (accountCode && parsed[accountCode]?.secret) {
    return parsed[accountCode].secret;
  }

  if (accountCode?.includes("AIRTEL") && parsed.airtel) return parsed.airtel.secret;
  if (accountCode?.includes("MOOV") && parsed.moov) return parsed.moov.secret;
  if (accountCode?.includes("GIMAC") && parsed.gimac) return parsed.gimac.secret;

  if (parsed.gimac) return parsed.gimac.secret;
  if (parsed.airtel) return parsed.airtel.secret;
  if (parsed.moov) return parsed.moov.secret;
  return null;
};

const renewSecretForOperator = async (operator: string, accountCode: string, token: string): Promise<string | null> => {
  try {
    const response = await fetch("https://api-akiba-1.onrender.com/api/renew-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        operationAccountCode: accountCode,
        password: "Jehov@h2508@",
      }),
    });

    const data = await response.json();

    if (response.ok && data.results?.length > 0 && data.results[0].data?.secret) {
      const secretKey = data.results[0].data.secret;
      const operationCode = data.results[0].data.operation_account_code || accountCode;

      persistSecretKey(operationCode, secretKey, operator, data.results[0].data.expires_in);
      return secretKey;
    }
    return null;
  } catch (error) {
    console.error(`Erreur renouvellement clé pour ${operator}:`, error);
    return null;
  }
};

// Fonction pour obtenir le token
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// --- Modes de paiement ---
const paymentMethods = [
  { id: "mobile", name: "Mobile Money", description: "Paiement par téléphone", icon: Smartphone },
  { id: "gimac", name: "GIMAC", description: "Paiement via GIMAC", icon: Building2 },
  { id: "qr", name: "QR Code", description: "Payez par QR code", icon: QrCode },
];

// --- Modes de livraison ---
const deliveryMethods = [
  { id: "pickup", name: "Retrait en magasin", price: 0, description: "Retirez votre commande gratuitement en magasin", icon: Store, delay: "Retrait immédiat" },
  { id: "standard", name: "Livraison Standard", price: 2500, description: "Livraison à domicile en 3-5 jours", icon: Truck, delay: "3-5 jours" },
  { id: "express", name: "Livraison Express", price: 5000, description: "Livraison à domicile en 1-2 jours", icon: Clock, delay: "1-2 jours" },
];

// --- Composant MobileMoneyInputs ---
function MobileMoneyInputs({ 
  onCustomerInfoChange,
  onValidationChange 
}: { 
  onCustomerInfoChange?: (info: CustomerInfo | null) => void;
  onValidationChange?: (isValid: boolean) => void;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("GA");
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isLoadingKyc, setIsLoadingKyc] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://api-akiba-1.onrender.com/api/mypvit/countries");
        const data = await response.json();
        if (data.success && data.data) {
          setCountries(data.data.filter((country: Country) => country.status === true));
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchOperators = async () => {
      if (!selectedCountry) return;
      setIsLoadingOperators(true);
      try {
        const response = await fetch(`https://api-akiba-1.onrender.com/api/mypvit/operators/${selectedCountry}`);
        const data = await response.json();
        if (data.success && data.data?.operators) {
          const activeOps = data.data.operators.filter((op: Operator) => op.active === true);
          setOperators(activeOps);
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error);
      } finally {
        setIsLoadingOperators(false);
      }
    };
    fetchOperators();
  }, [selectedCountry]);

  // KYC effect
  useEffect(() => {
    const fetchKYC = async () => {
      if (phoneNumber && phoneNumber.length >= 9) {
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        if (cleanNumber.length >= 9) {
          setIsLoadingKyc(true);
          try {
            const token = getToken();
            if (!token) return;

            const response = await fetch(`/api/mypvit/withdraw/kyc?customerAccountNumber=${cleanNumber}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await response.json();
            if (data.success && data.data) {
              const info = {
                fullName: data.data.full_name,
                customerAccountNumber: data.data.customer_account_number,
                isActive: data.data.is_active,
                operator: data.data.operator,
                account_code: data.data.account_code,
              };
              setCustomerInfo(info);
              onCustomerInfoChange?.(info);
              
              if (data.data.operator && data.data.account_code) {
                await renewSecretForOperator(data.data.operator, data.data.account_code, token);
              }
            } else {
              setCustomerInfo(null);
              onCustomerInfoChange?.(null);
            }
          } catch (error) {
            console.error("Erreur KYC:", error);
            setCustomerInfo(null);
            onCustomerInfoChange?.(null);
          } finally {
            setIsLoadingKyc(false);
          }
        }
      } else {
        setCustomerInfo(null);
        onCustomerInfoChange?.(null);
      }
    };
    fetchKYC();
  }, [phoneNumber, onCustomerInfoChange]);

  // Validation
  useEffect(() => {
    const isValid = !!phoneNumber && phoneNumber.length >= 9 && !!selectedOperator && !!customerInfo;
    onValidationChange?.(isValid);
  }, [phoneNumber, selectedOperator, customerInfo, onValidationChange]);

  return (
    <div className="mt-6 space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Pays
        </Label>
        {isLoadingCountries ? (
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-sm">Chargement...</span>
          </div>
        ) : (
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.iso_code} value={country.iso_code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCountry && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            Opérateur Mobile Money
          </Label>
          {isLoadingOperators ? (
            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm">Chargement...</span>
            </div>
          ) : (
            <Select value={selectedOperator} onValueChange={setSelectedOperator}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sélectionnez votre opérateur" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator.code} value={operator.code}>
                    <div className="flex flex-col">
                      <span>{operator.name}</span>
                      <span className="text-xs text-muted-foreground">{operator.provider}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          placeholder="Ex: 07X XXX XXX"
          className="h-11"
        />
      </div>

      {isLoadingKyc && (
        <div className="flex items-center text-sm text-gray-500">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Vérification des informations...
        </div>
      )}

      {customerInfo && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">{customerInfo.fullName}</span>
            {customerInfo.operator && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                customerInfo.operator.toLowerCase().includes('moov') ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              }`}>
                {customerInfo.operator}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-green-600 mt-0.5" />
          <p className="text-xs text-green-800">
            Vous recevrez une demande de paiement sur votre téléphone.
            Des frais de transaction (3% + 50 FCFA) peuvent s'appliquer.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Composant GIMACInputs ---
function GIMACInputs({ 
  onValidationChange,
  onSecretReady,
  amount
}: { 
  onValidationChange?: (isValid: boolean) => void;
  onSecretReady?: (secret: string) => void;
  amount?: number;
}) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [identifier, setIdentifier] = useState<string>("");
  const [identifierType, setIdentifierType] = useState<"phone" | "card">("phone");
  const [gimacSecretKey, setGimacSecretKey] = useState<string>("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [isLoadingSecret, setIsLoadingSecret] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://api-akiba-1.onrender.com/api/mypvit/countries");
        const data = await response.json();
        if (data.success && data.data) {
          setCountries(data.data.filter((country: Country) => country.status === true));
        }
      } catch (error) {
        console.error("Erreur chargement pays:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchOperators = async () => {
      if (!selectedCountry) return;
      setIsLoadingOperators(true);
      try {
        const response = await fetch(`https://api-akiba-1.onrender.com/api/mypvit/operators/${selectedCountry}`);
        const data = await response.json();
        if (data.success && data.data?.operators) {
          const activeOps = data.data.operators.filter((op: Operator) => op.active === true);
          setOperators(activeOps);
        }
      } catch (error) {
        console.error("Erreur chargement opérateurs:", error);
      } finally {
        setIsLoadingOperators(false);
      }
    };
    fetchOperators();
  }, [selectedCountry]);

  const requestSecret = async (operator: Operator) => {
    if (!operator) return;
    const token = getToken();
    if (!token) return;

    setIsLoadingSecret(true);
    try {
      const secret = await renewSecretForOperator("GIMAC", GIMAC_ACCOUNT_CODE, token);
      if (secret) {
        setGimacSecretKey(secret);
        onSecretReady?.(secret);
        toast({
          title: "Clé GIMAC générée",
          description: "La clé de sécurité a été générée avec succès.",
        });
      }
    } catch (error) {
      console.error("Erreur génération clé:", error);
    } finally {
      setIsLoadingSecret(false);
    }
  };

  const handleOperatorSelect = async (operator: Operator) => {
    setSelectedOperator(operator);
    await requestSecret(operator);
  };

  useEffect(() => {
    const isValid = !!selectedOperator && !!identifier && !!gimacSecretKey;
    onValidationChange?.(isValid);
  }, [selectedOperator, identifier, gimacSecretKey, onValidationChange]);

  return (
    <div className="mt-6 space-y-5">
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          Pays
        </Label>
        {isLoadingCountries ? (
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="ml-2 text-sm">Chargement...</span>
          </div>
        ) : (
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionnez votre pays" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.iso_code} value={country.iso_code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCountry && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Opérateur GIMAC
          </Label>
          {isLoadingOperators ? (
            <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm">Chargement des opérateurs...</span>
            </div>
          ) : selectedOperator ? (
            <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{selectedOperator.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOperator.provider}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedOperator(null)}>
                  Changer
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {operators.map((operator) => (
                <div
                  key={operator.code}
                  onClick={() => handleOperatorSelect(operator)}
                  className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{operator.name}</p>
                    <p className="text-xs text-muted-foreground">{operator.provider}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedOperator && (
        <>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Type d'identifiant</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={identifierType === "phone"}
                  onChange={() => setIdentifierType("phone")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Numéro de téléphone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={identifierType === "card"}
                  onChange={() => setIdentifierType("card")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm">Numéro de carte</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{identifierType === "phone" ? "Numéro de téléphone" : "Numéro de carte"}</Label>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={identifierType === "phone" ? "+241 06 00 00 00" : "1234 5678 9012 3456"}
              className="h-11"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <p>Clé secrète GIMAC</p>
              <p className="font-mono text-sm text-gray-900">
                {gimacSecretKey ? `${gimacSecretKey.substring(0, 10)}...` : "Non générée"}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => requestSecret(selectedOperator)}
              disabled={isLoadingSecret}
            >
              {isLoadingSecret ? <Loader2 className="h-4 w-4 animate-spin" /> : "Générer la clé"}
            </Button>
          </div>

          {amount && amount > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">
                Montant à payer : {amount.toLocaleString()} FCFA
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Composant PaymentStatusModal ---
function PaymentStatusModal({ 
  isOpen, 
  onClose, 
  status, 
  message, 
  transactionId, 
  onSuccess, 
  onRetry 
}: {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'success' | 'failed';
  message: string;
  transactionId: string | null;
  onSuccess: () => void;
  onRetry?: () => void;
}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [checkCount, setCheckCount] = useState(0);

  const checkPaymentStatus = async () => {
    if (!transactionId) return;

    try {
      const secretKey = getSecretKeyForAccount(GIMAC_ACCOUNT_CODE);
      if (!secretKey) return;

      const response = await fetch(
        `/api/mypvit/status?transactionId=${transactionId}&accountOperationCode=${GIMAC_ACCOUNT_CODE}&transactionOperation=PAYMENT`,
        {
          headers: {
            "X-Secret": secretKey,
          },
        }
      );
      const data = await response.json();

      if (data.success && data.data?.status === "SUCCESS") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onSuccess();
        onClose();
      } else if (checkCount >= 12) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setCheckCount(0);
      } else {
        setCheckCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Erreur vérification:", error);
    }
  };

  useEffect(() => {
    if (!isOpen || status !== 'pending') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(checkPaymentStatus, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, status, transactionId]);

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
            <p className="text-muted-foreground">{message}</p>
          </div>
          <Button onClick={onClose} className="w-full">Continuer</Button>
        </DialogContent>
      </Dialog>
    );
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
    );
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
          <Button variant="outline" size="sm" className="mt-4" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Composant principal ---
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isGimacValid, setIsGimacValid] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [gimacSecret, setGimacSecret] = useState<string>("");
  
  const [paymentStatus, setPaymentStatus] = useState<{
    show: boolean;
    status: 'pending' | 'success' | 'failed';
    message: string;
    transactionId: string | null;
  }>({ show: false, status: 'pending', message: '', transactionId: null });

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const selectedDelivery = deliveryMethods.find((d) => d.id === deliveryMethod) || deliveryMethods[0];
  const total = subtotal + selectedDelivery.price;
  const isDeliverySelected = deliveryMethod !== "pickup";
  const isFormValid = paymentMethod === "mobile" ? isMobileValid : paymentMethod === "gimac" ? isGimacValid : true;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const processPayment = async (orderData: any): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    if (paymentMethod === "mobile" && customerInfo) {
      const token = getToken();
      const secretKey = getSecretKeyForAccount(customerInfo.account_code);

      if (!secretKey) {
        return { success: false, error: "Clé secrète non disponible" };
      }

      const payload = {
        amount: total,
        customer_account_number: shippingInfo.phone,
        merchant_operation_account_code: customerInfo.account_code,
        transaction_type: "PAYMENT",
        operator_code: customerInfo.operator,
        callback_url_code: "1MAKL",
        free_info: `Paiement commande ${orderData.data.orderNumber}`,
        client_id: user?.id,
      };

      const response = await fetch("/api/mypvit/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Secret": secretKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success && data.data) {
        return { success: true, transactionId: data.data.merchant_reference_id || data.data.reference_id };
      }
      return { success: false, error: data.message || "Échec du paiement" };
    }

    if (paymentMethod === "gimac" && gimacSecret) {
      const token = getToken();
      
      const payload = {
        amount: total,
        customer_account_number: shippingInfo.phone,
        merchant_operation_account_code: GIMAC_ACCOUNT_CODE,
        transaction_type: "PAYMENT",
        operator_code: "GIMAC",
        callback_url_code: "1MAKL",
        free_info: `Paiement commande ${orderData.data.orderNumber}`,
        client_id: user?.id,
      };

      const response = await fetch("/api/mypvit/rest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Secret": gimacSecret,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success && data.data) {
        return { success: true, transactionId: data.data.merchant_reference_id || data.data.reference_id };
      }
      return { success: false, error: data.message || "Échec du paiement GIMAC" };
    }

    if (paymentMethod === "qr") {
      const qrUrl = `https://api-akiba-1.onrender.com/api/mypvit/qr-code/direct/generate?amount=${total}&payment_api_key_public=pk_1773325888803_dt8diavuh3h&payment_api_key_secret=sk_1773325888803_qt015a3cr5`;
      setQrCodeUrl(qrUrl);
      setShowQRModal(true);
      return { success: true };
    }

    return { success: false, error: "Mode de paiement non supporté" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingInfo.fullName.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre nom complet", variant: "destructive" });
      return;
    }
    if (!shippingInfo.email.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre email", variant: "destructive" });
      return;
    }
    if (!shippingInfo.phone.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre numéro de téléphone", variant: "destructive" });
      return;
    }
    if (isDeliverySelected && !shippingInfo.address.trim()) {
      toast({ title: "Champ requis", description: "Veuillez saisir votre adresse de livraison", variant: "destructive" });
      return;
    }
    if (!isFormValid) {
      toast({ title: "Formulaire incomplet", description: "Veuillez compléter toutes les informations de paiement", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const deliveryAddress = isDeliverySelected ? `${shippingInfo.address}, ${shippingInfo.city}` : "Retrait en magasin";

      const response = await fetch("https://ecomerce-api-1-dp0w.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          customerAccountNumber: shippingInfo.phone,
          shippingAddress: deliveryAddress,
          billingAddress: deliveryAddress,
          deliveryMethod: deliveryMethod,
          deliveryPrice: selectedDelivery.price,
          notes: shippingInfo.notes || null,
          customerName: shippingInfo.fullName,
          customerEmail: shippingInfo.email,
        }),
      });

      const orderData = await response.json();

      if (orderData.success) {
        setOrderNumber(orderData.data.orderNumber);

        const paymentResult = await processPayment(orderData);

        if (paymentResult.success) {
          if (paymentMethod === "qr") {
            setIsSubmitting(false);
          } else if (paymentResult.transactionId) {
            setPaymentStatus({
              show: true,
              status: 'pending',
              message: 'Paiement en cours de traitement...',
              transactionId: paymentResult.transactionId,
            });
            setIsSubmitting(false);
          } else {
            setIsComplete(true);
            clearCart();
            toast({
              title: "Commande confirmée !",
              description: `Votre commande #${orderData.data.orderNumber} a été créée avec succès.`,
            });
            setIsSubmitting(false);
          }
        } else {
          setPaymentStatus({
            show: true,
            status: 'failed',
            message: paymentResult.error || 'Le paiement n\'a pas pu être initié',
            transactionId: null,
          });
          setIsSubmitting(false);
        }
      } else {
        toast({ title: "Erreur", description: orderData.message || "Une erreur est survenue", variant: "destructive" });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({ title: "Erreur", description: "Impossible de contacter le serveur", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsComplete(true);
    clearCart();
    toast({
      title: "Commande confirmée !",
      description: `Votre commande #${orderNumber} a été payée avec succès.`,
    });
  };

  const handlePaymentRetry = () => {
    handleSubmit(new Event('submit') as any);
  };

  const handleQRCodeClose = () => {
    setShowQRModal(false);
    setIsComplete(true);
    clearCart();
    toast({
      title: "Commande confirmée !",
      description: `Votre commande #${orderNumber} a été créée avec succès.`,
    });
  };

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
            <Link href="/">
              <Button size="lg" className="w-full">Retour à l'accueil</Button>
            </Link>
            <Link href="/commandes">
              <Button variant="outline" size="lg" className="w-full">Voir mes commandes</Button>
            </Link>
          </div>
        </div>
      </main>
    );
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

                  {isDeliverySelected && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Adresse de livraison</Label>
                        <Input name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="Rue des Jardins, Cocody" className="h-11" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Ville</Label>
                        <Input name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="Abidjan" className="h-11" required />
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
                    <Textarea name="notes" value={shippingInfo.notes} onChange={handleInputChange} placeholder={isDeliverySelected ? "Instructions de livraison..." : "Informations supplémentaires..."} rows={3} />
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
                        const Icon = method.icon;
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
                        );
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
                        const Icon = method.icon;
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
                        );
                      })}
                    </div>
                  </RadioGroup>

                  {paymentMethod === "mobile" && (
                    <MobileMoneyInputs 
                      onCustomerInfoChange={setCustomerInfo}
                      onValidationChange={setIsMobileValid}
                    />
                  )}
                  
                  {paymentMethod === "gimac" && (
                    <GIMACInputs 
                      onValidationChange={setIsGimacValid}
                      onSecretReady={setGimacSecret}
                      amount={total}
                    />
                  )}
                  
                  {paymentMethod === "qr" && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                      <QrCode className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Un QR code sera généré pour finaliser votre paiement.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubmitting || !isFormValid}
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
                        <span className="font-medium text-green-600">+{selectedDelivery.price.toLocaleString()} FCFA</span>
                      )}
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

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
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
                <img src={qrCodeUrl} alt="QR Code de paiement" className="w-64 h-64 object-contain" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-64 h-64 bg-gray-100 rounded-xl">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            <div className="mt-6 w-full text-center">
              <p className="text-2xl font-bold text-primary">{total.toLocaleString()} FCFA</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleQRCodeClose} className="w-full">J'ai payé</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={paymentStatus.show}
        onClose={() => setPaymentStatus(prev => ({ ...prev, show: false }))}
        status={paymentStatus.status}
        message={paymentStatus.message}
        transactionId={paymentStatus.transactionId}
        onSuccess={handlePaymentSuccess}
        onRetry={handlePaymentRetry}
      />
    </main>
  );
}
