"use client"

import Link from "next/link"
import { 
  PackageX, 
  Clock, 
  Shield, 
  RefreshCw, 
  CreditCard, 
  Phone, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Truck,
  Calendar,
  FileText,
  Home,
  ChevronRight,
  HelpCircle,
  ThumbsUp,
  DollarSign,
  Receipt
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ReturnPolicyPage() {
  const returnSteps = [
    { step: 1, title: "Contactez-nous", description: "Envoyez un email à support@paradisalimentaire.ci avec votre numéro de commande", icon: Mail, color: "bg-blue-100 text-blue-600" },
    { step: 2, title: "Préparez le colis", description: "Emballez les produits dans leur emballage d'origine", icon: PackageX, color: "bg-yellow-100 text-yellow-600" },
    { step: 3, title: "Expédiez le colis", description: "Déposez le colis dans un point de dépôt agréé", icon: Truck, color: "bg-green-100 text-green-600" },
    { step: 4, title: "Recevez le remboursement", description: "Remboursement sous 72h après réception", icon: CreditCard, color: "bg-purple-100 text-purple-600" }
  ]

  const eligibleProducts = [
    "Produits alimentaires non périssables (non ouverts)",
    "Produits frais (défectueux ou erreur de commande uniquement)",
    "Articles en promotion (conditions spéciales)",
    "Produits en conserve (non ouverts)",
    "Produits surgelés (transport réfrigéré requis)"
  ]

  const nonEligibleProducts = [
    "Produits alimentaires périssables entamés",
    "Produits frais commandés par erreur",
    "Articles en solde (sauf défaut)",
    "Produits dont la date de péremption est dépassée",
    "Produits sur mesure ou personnalisés"
  ]

  const faqs = [
    {
      question: "Quel est le délai pour retourner un produit ?",
      answer: "Vous disposez de 7 jours à compter de la réception de votre commande pour effectuer un retour. Au-delà de ce délai, aucun retour ne sera accepté."
    },
    {
      question: "Comment obtenir un remboursement ?",
      answer: "Une fois votre colis reçu et vérifié, nous procédons au remboursement sous 72h. Le remboursement est effectué sur le mode de paiement utilisé lors de la commande."
    },
    {
      question: "Les frais de livraison sont-ils remboursés ?",
      answer: "En cas de retour pour cause d'erreur de notre part ou de produit défectueux, les frais de livraison sont intégralement remboursés. Pour un retour pour changement d'avis, les frais de livraison restent à votre charge."
    },
    {
      question: "Comment retourner un produit frais ?",
      answer: "Pour les produits frais, contactez-nous immédiatement après réception. Nous organiserons un retour rapide avec un transport réfrigéré pour garantir la qualité du produit."
    },
    {
      question: "Puis-je échanger un produit plutôt que d'être remboursé ?",
      answer: "Oui, nous proposons l'échange dans la limite des stocks disponibles. Contactez notre service client pour organiser l'échange."
    },
    {
      question: "Que faire si je reçois un produit endommagé ?",
      answer: "Prenez des photos du produit et de l'emballage, puis contactez-nous dans les 24h suivant la réception. Nous organiserons un retour et un remplacement rapide."
    }
  ]

  return (
    <main className="flex min-h-screen flex-col pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Fil d'Ariane */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Politique de retour</span>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <RefreshCw className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Politique de retour
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Votre satisfaction est notre priorité. Découvrez nos conditions et procédures de retour pour une expérience d'achat sereine.
          </p>
        </div>

        {/* Cartes récapitulatives */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold mb-1">7 jours</p>
              <p className="text-xs text-muted-foreground">pour retourner un produit</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold mb-1">100% sécurisé</p>
              <p className="text-xs text-muted-foreground">retours garantis</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold mb-1">72h</p>
              <p className="text-xs text-muted-foreground">remboursement express</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold mb-1">Gratuit</p>
              <p className="text-xs text-muted-foreground">retrait à domicile disponible</p>
            </CardContent>
          </Card>
        </div>

        {/* Processus de retour */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <PackageX className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Comment retourner un produit ?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-2xl" />
                  <CardContent className="p-6 text-center">
                    <div className={`h-14 w-14 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/10">
                      Étape {step.step}
                    </Badge>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Produits éligibles et non éligibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                Produits éligibles au retour
              </CardTitle>
              <CardDescription>
                Ces produits peuvent être retournés selon nos conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {eligibleProducts.map((product, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{product}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <XCircle className="h-5 w-5" />
                Produits non éligibles
              </CardTitle>
              <CardDescription>
                Ces produits ne peuvent pas être retournés sauf défaut avéré
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {nonEligibleProducts.map((product, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>{product}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Conditions de retour */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Conditions générales</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">État des produits</h3>
                  <p className="text-sm text-muted-foreground">
                    Les produits doivent être retournés dans leur emballage d'origine, non utilisés, 
                    avec tous les accessoires et étiquettes intactes. Les produits frais doivent être 
                    retournés immédiatement après constatation du défaut.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Délai de retour</h3>
                  <p className="text-sm text-muted-foreground">
                    Le délai de rétractation est de 7 jours à compter de la réception de votre commande. 
                    Pour les produits défectueux, contactez-nous dans les 24h suivant la réception.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Receipt className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Justificatifs requis</h3>
                  <p className="text-sm text-muted-foreground">
                    Pour tout retour, vous devez fournir votre numéro de commande, la facture d'achat, 
                    et des photos du produit (en cas de défaut).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remboursement */}
        <div className="mb-12">
          <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                Modalités de remboursement
              </CardTitle>
              <CardDescription>
                Comment et quand serez-vous remboursé ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Remboursement bancaire</p>
                      <p className="text-xs text-muted-foreground">Sous 72h après réception du colis</p>
                    </div>
                  </div>
                  <Badge>Standard</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Avoir en magasin</p>
                      <p className="text-xs text-muted-foreground">Valable 6 mois, utilisable en ligne et en magasin</p>
                    </div>
                  </div>
                  <Badge variant="outline">Express</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Échange gratuit</p>
                      <p className="text-xs text-muted-foreground">Sous 48h, livraison offerte</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Recommandé</Badge>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">99% de nos retours sont traités en moins de 48h</span>
                </div>
                <Progress value={99} className="h-1 mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Accordéon */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Questions fréquentes</h2>
          </div>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact support */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Besoin d'aide pour un retour ?</h3>
            <p className="text-muted-foreground mb-6">
              Notre équipe est disponible pour vous accompagner dans votre démarche de retour
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="default" className="gap-2">
                <Link href="/contact">
                  <MessageCircle className="h-4 w-4" />
                  Contacter le support
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/commandes">
                  <PackageX className="h-4 w-4" />
                  Voir mes commandes
                </Link>
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-center gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+225 07 XX XX XX XX</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>retours@paradisalimentaire.ci</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Lun-Ven: 8h-18h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note importante */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Note importante</p>
              <p className="text-xs text-yellow-700">
                Pour les produits frais et périssables, contactez-nous immédiatement après réception 
                en cas de problème. Les retours pour ce type de produits doivent être signalés dans 
                les 24h suivant la livraison.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}