"use client"

import Link from "next/link"
import Image from "next/image"
import {
    Truck,
    Clock,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
    Package,
    Calendar,
    CreditCard,
    Shield,
    Globe,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Map,
    DollarSign,
    RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export default function DeliveryPolicyPage() {
    const deliveryZones = [
        { zone: "Abidjan (Cocody, Plateau, Marcory)", delay: "24-48h", price: "1 500 FCFA", color: "bg-green-100 text-green-700" },
        { zone: "Grand Abidjan (Yopougon, Adjamé, Treichville)", delay: "24-48h", price: "2 000 FCFA", color: "bg-blue-100 text-blue-700" },
        { zone: "Villes principales (Bouaké, Daloa, San Pedro)", delay: "48-72h", price: "3 500 FCFA", color: "bg-orange-100 text-orange-700" },
        { zone: "Autres villes de Côte d'Ivoire", delay: "3-5 jours", price: "5 000 FCFA", color: "bg-purple-100 text-purple-700" },
        { zone: "International (Afrique de l'Ouest)", delay: "5-7 jours", price: "15 000 FCFA", color: "bg-pink-100 text-pink-700" },
    ]

    const faqs = [
        {
            question: "Quels sont les délais de livraison ?",
            answer: "Les délais varient selon votre localisation : 24-48h pour Abidjan, 48-72h pour les grandes villes, 3-5 jours pour les autres villes de Côte d'Ivoire, et 5-7 jours pour l'international."
        },
        {
            question: "Comment suivre ma commande ?",
            answer: "Un email de confirmation avec numéro de suivi vous est envoyé dès l'expédition. Vous pouvez également suivre votre commande depuis votre espace client dans la rubrique 'Mes commandes'."
        },
        {
            question: "Que faire si je ne suis pas présent à la livraison ?",
            answer: "Notre livreur vous contactera par téléphone. Si vous n'êtes pas disponible, une nouvelle tentative sera effectuée le lendemain. Après 2 tentatives infructueuses, la commande sera retournée et vous serez remboursé."
        },
        {
            question: "Livrez-vous en point relais ?",
            answer: "Oui, nous proposons la livraison en point relais dans plusieurs zones d'Abidjan. Sélectionnez cette option lors du passage en caisse."
        },
        {
            question: "Les frais de livraison sont-ils remboursés en cas d'annulation ?",
            answer: "En cas d'annulation avant expédition, les frais de livraison sont intégralement remboursés. Après expédition, ils ne sont pas remboursables sauf en cas d'erreur de notre part."
        },
        {
            question: "Livrez-vous le week-end ?",
            answer: "Oui, nous livrons le samedi matin. Les livraisons du dimanche ne sont pas disponibles pour le moment."
        }
    ]

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header avec fil d'Ariane */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground font-medium">Politique de livraison</span>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Truck className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Politique de livraison
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Nous nous engageons à livrer vos produits frais et de qualité dans les meilleurs délais,
                        partout en Côte d'Ivoire et à l'international.
                    </p>
                </div>

                {/* Carte récapitulative */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Délais de livraison</h3>
                                    <p className="text-sm text-muted-foreground">24h à 7 jours selon votre zone</p>
                                    <Badge variant="outline" className="mt-2 bg-green-50 text-green-600 border-green-200">
                                        Express disponible
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Frais de livraison</h3>
                                    <p className="text-sm text-muted-foreground">À partir de 1 500 FCFA</p>
                                    <Badge variant="outline" className="mt-2 bg-green-50 text-green-600 border-green-200">
                                        Livraison gratuite dès 50 000 FCFA
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Livraison sécurisée</h3>
                                    <p className="text-sm text-muted-foreground">Suivi en temps réel</p>
                                    <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-600 border-blue-200">
                                        Assurance incluse
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Zones de livraison */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Zones de livraison</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deliveryZones.map((zone, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Map className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{zone.zone}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">{zone.delay}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{zone.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Processus de livraison */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold">Comment ça marche ?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { step: 1, icon: ShoppingCart, title: "Passer commande", desc: "Choisissez vos produits et validez votre panier" },
                            { step: 2, icon: CreditCard, title: "Paiement sécurisé", desc: "Réglez en ligne ou à la livraison" },
                            { step: 3, icon: Package, title: "Préparation", desc: "Nous préparons votre commande avec soin" },
                            { step: 4, icon: Truck, title: "Livraison", desc: "Livraison à l'adresse indiquée" }
                        ].map((item, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
                                <CardContent className="p-6 text-center">
                                    <div className="relative">
                                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <item.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        {index < 3 && (
                                            <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-primary/20">
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                                            Étape {item.step}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-green-600" />
                                Livraison gratuite
                            </CardTitle>
                            <CardDescription>
                                Profitez de la livraison gratuite pour toute commande supérieure à 50 000 FCFA
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white rounded-lg p-4 border border-green-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Montant minimum</span>
                                    <span className="text-lg font-bold text-green-600">50 000 FCFA</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Ajoutez encore 30 000 FCFA pour bénéficier de la livraison gratuite
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5 text-blue-600" />
                                Retours et remboursements
                            </CardTitle>
                            <CardDescription>
                                Vous n'êtes pas satisfait ? Nous reprenons les produits non consommés
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Retour sous 7 jours après réception</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Produits frais non ouverts acceptés</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Remboursement sous 72h après réception</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ Accordéon */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <MessageCircle className="h-6 w-6 text-primary" />
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
                            <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Besoin d'aide pour votre livraison ?</h3>
                        <p className="text-muted-foreground mb-6">
                            Notre service client est à votre disposition pour répondre à toutes vos questions
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button asChild variant="default" className="gap-2">
                                <Link href="/contact">
                                    <MessageCircle className="h-4 w-4" />
                                    Nous contacter
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="gap-2">
                                <Link href="/suivi-commande">
                                    <MapPin className="h-4 w-4" />
                                    Suivre ma commande
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/20 flex justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+225 07 XX XX XX XX</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>livraison@paradisalimentaire.ci</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}

// Composant d'icône manquant
function ShoppingCart(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}