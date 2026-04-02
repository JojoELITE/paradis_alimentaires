// app/politique-confidentialite/page.tsx

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  Mail, 
  Trash2, 
  RefreshCw,
  FileText,
  UserCheck,
  AlertTriangle,
  Share2,
  Clock,
  Globe
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PolitiqueConfidentialitePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const currentYear = new Date().getFullYear()
  const lastUpdate = "15 Mars 2025"

  const sections = [
    {
      icon: Database,
      title: "1. Collecte des informations",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Nous collectons les informations que vous nous fournissez directement lorsque vous :</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Créez un compte client</li>
            <li>Passez une commande</li>
            <li>Vous abonnez à notre newsletter</li>
            <li>Contactez notre service client</li>
            <li>Participez à nos programmes de fidélité</li>
          </ul>
          <p className="mt-3">Les informations collectées peuvent inclure :</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Nom, prénom et civilité</li>
            <li>Adresse email et numéro de téléphone</li>
            <li>Adresse de livraison et de facturation</li>
            <li>Historique des commandes et préférences d'achat</li>
            <li>Données de paiement (cryptées)</li>
          </ul>
        </div>
      )
    },
    {
      icon: Lock,
      title: "2. Utilisation des informations",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Vos informations sont utilisées pour :</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Traiter et gérer vos commandes</li>
            <li>Assurer la livraison de vos produits</li>
            <li>Gérer votre compte client</li>
            <li>Vous informer sur l'état de vos commandes</li>
            <li>Améliorer notre service client et notre site web</li>
            <li>Vous envoyer des offres personnalisées (avec votre consentement)</li>
            <li>Prévenir et détecter les fraudes</li>
          </ul>
        </div>
      )
    },
    {
      icon: Cookie,
      title: "3. Cookies et technologies similaires",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Notre site utilise différents types de cookies :</p>
          <div className="space-y-4 mt-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-foreground">Cookies essentiels</p>
              <p className="text-sm">Nécessaires au fonctionnement du site (panier, connexion, paiement).</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-foreground">Cookies de performance</p>
              <p className="text-sm">Nous aident à analyser l'utilisation du site pour l'améliorer.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-foreground">Cookies de fonctionnalité</p>
              <p className="text-sm">Mémorisent vos préférences (langue, région).</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-foreground">Cookies publicitaires</p>
              <p className="text-sm">Personnalisent les annonces selon vos centres d'intérêt.</p>
            </div>
          </div>
          <p className="mt-3">Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.</p>
        </div>
      )
    },
    {
      icon: Share2,
      title: "4. Partage des informations",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Nous ne vendons pas vos données personnelles. Cependant, nous pouvons partager vos informations avec :</p>
          <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
            <li>Nos prestataires de livraison pour l'acheminement de vos commandes</li>
            <li>Nos partenaires de paiement sécurisé</li>
            <li>Les autorités légales si requis par la loi</li>
          </ul>
          <p className="mt-3">Tous nos partenaires sont tenus de respecter la confidentialité de vos données.</p>
        </div>
      )
    },
    {
      icon: Shield,
      title: "5. Sécurité des données",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Nous mettons en œuvre des mesures de sécurité avancées pour protéger vos données :</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Chiffrement SSL/TLS pour toutes les transmissions de données</li>
            <li>Stockage sécurisé des mots de passe (hashage)</li>
            <li>Authentification à deux facteurs (2FA) pour les comptes sensibles</li>
            <li>Surveillance continue des accès suspects</li>
            <li>Sauvegardes régulières et chiffrées</li>
          </ul>
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              ✅ Conformité PCI DSS pour les paiements par carte bancaire
            </p>
          </div>
        </div>
      )
    },
    {
      icon: UserCheck,
      title: "6. Vos droits",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Conformément au RGPD et à la loi ivoirienne, vous disposez des droits suivants :</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-semibold text-foreground">Droit d'accès</p>
              <p className="text-sm">Connaître les données que nous détenons sur vous</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-semibold text-foreground">Droit de rectification</p>
              <p className="text-sm">Modifier vos informations inexactes</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-semibold text-foreground">Droit à l'effacement</p>
              <p className="text-sm">Supprimer vos données ("droit à l'oubli")</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-semibold text-foreground">Droit à la portabilité</p>
              <p className="text-sm">Récupérer vos données dans un format lisible</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-semibold text-foreground">Droit d'opposition</p>
              <p className="text-sm">Refuser l'utilisation de vos données pour le marketing</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-lg">
              <p className="font-semibold text-foreground">Droit de limitation</p>
              <p className="text-sm">Restreindre temporairement le traitement</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Clock,
      title: "7. Conservation des données",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Nous conservons vos données personnelles pour la durée nécessaire aux finalités pour lesquelles elles ont été collectées :</p>
          <div className="space-y-2 mt-3">
            <div className="flex justify-between items-center p-2 border-b">
              <span>Données de compte client</span>
              <Badge variant="outline">5 ans après la dernière activité</Badge>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>Historique des commandes</span>
              <Badge variant="outline">10 ans (obligation légale)</Badge>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>Données de paiement</span>
              <Badge variant="outline">13 mois (conformité bancaire)</Badge>
            </div>
            <div className="flex justify-between items-center p-2 border-b">
              <span>Newsletter</span>
              <Badge variant="outline">Jusqu'au désabonnement</Badge>
            </div>
            <div className="flex justify-between items-center p-2">
              <span>Cookies</span>
              <Badge variant="outline">13 mois maximum</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Mail,
      title: "8. Contact du DPO",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Pour toute question relative à la protection de vos données ou pour exercer vos droits, contactez notre Délégué à la Protection des Données (DPO) :</p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 mt-3">
            <p><span className="font-semibold text-foreground">📧 Email :</span> <a href="mailto:dpo@paradis-alimentaire.ci" className="text-primary hover:underline">dpo@paradis-alimentaire.ci</a></p>
            <p><span className="font-semibold text-foreground">📞 Téléphone :</span> +225 27 20 12 34 56 poste 123</p>
            <p><span className="font-semibold text-foreground">📝 Formulaire :</span> <Link href="/contact" className="text-primary hover:underline">Formulaire de contact</Link></p>
            <p><span className="font-semibold text-foreground">📍 Adresse :</span> Service DPO, Paradis Alimentaire, Cocody Rue des Jardins, Abidjan</p>
          </div>
          <p className="text-sm mt-3">Nous nous engageons à répondre à votre demande dans un délai maximum de 30 jours.</p>
        </div>
      )
    }
  ]

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Chez Paradis Alimentaire, la protection de vos données personnelles est notre priorité. 
            Découvrez comment nous collectons, utilisons et protégeons vos informations.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Dernière mise à jour : {lastUpdate}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Version 2.0
            </span>
          </div>
        </div>

        {/* Introduction Card */}
        <Card className="border-none shadow-lg bg-primary/5 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-2">Engagement de transparence</p>
                <p className="text-sm text-muted-foreground">
                  Cette politique de confidentialité s'applique à l'ensemble des services proposés par Paradis Alimentaire, 
                  incluant notre site web, notre application mobile et nos services de livraison. Nous nous engageons à respecter 
                  scrupuleusement le Règlement Général sur la Protection des Données (RGPD) et la loi ivoirienne n°2013-450 du 19 juin 2013.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections Accordion pour meilleure UX sur mobile */}
        <div className="md:hidden">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-none shadow-lg rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <section.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Sections Grid pour desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
                <Separator className="mt-3" />
              </CardHeader>
              <CardContent>
                {section.content}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consentement et retrait */}
        <Card className="border-none shadow-lg mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Consentement et retrait
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              En utilisant notre site, vous consentez à notre politique de confidentialité et à la collecte 
              de vos informations selon les modalités décrites ci-dessus.
            </p>
            <p>
              Vous pouvez retirer votre consentement à tout moment en :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Modifiant les paramètres de votre compte</li>
              <li>Cliquant sur "Se désabonner" dans nos emails</li>
              <li>Contactant notre DPO à l'adresse mentionnée ci-dessus</li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>En cas de retrait de consentement, certaines fonctionnalités du site pourraient ne plus être accessibles (ex: historique des commandes, programmes de fidélité).</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Réclamations */}
        <Card className="border-none shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Droit de réclamation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Si vous estimez que vos droits sur vos données personnelles ne sont pas respectés, vous avez le droit 
              d'introduire une réclamation auprès de :
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Notre Délégué à la Protection des Données (DPO)</li>
              <li>L'autorité de contrôle compétente : <span className="font-semibold">ARTCI (Côte d'Ivoire)</span></li>
              <li>La <span className="font-semibold">CNIL</span> pour les résidents européens</li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Paradis Alimentaire - Tous droits réservés</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link href="/mentions-legales" className="hover:text-primary transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:text-primary transition-colors">
              CGV
            </Link>
            <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

// Composant Badge simple (à remplacer par import si tu as shadcn)
const Badge = ({ children, variant }: { children: React.ReactNode; variant?: string }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {children}
    </span>
  )
}
