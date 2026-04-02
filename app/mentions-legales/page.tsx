// app/mentions-legales/page.tsx

"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Shield, FileText, Scale, Users, MapPin, Phone, Mail, Building, Globe, Lock, Eye, FileCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function MentionsLegalesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const currentYear = new Date().getFullYear()

  const sections = [
    {
      icon: Building,
      title: "Éditeur du site",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p><span className="font-semibold text-foreground">Nom de l'entreprise :</span> Paradis Alimentaire</p>
          <p><span className="font-semibold text-foreground">Forme juridique :</span> Société à Responsabilité Limitée (SARL)</p>
          <p><span className="font-semibold text-foreground">Capital social :</span> 10.000.000 FCFA</p>
          <p><span className="font-semibold text-foreground">RCCM :</span> CI-ABJ-2024-123456</p>
          <p><span className="font-semibold text-foreground">N° d'identification fiscale :</span> 1234567890123</p>
          <p><span className="font-semibold text-foreground">Adresse du siège social :</span> Cocody, Rue des Jardins, Abidjan, Côte d'Ivoire</p>
        </div>
      )
    },
    {
      icon: Phone,
      title: "Coordonnées",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p><span className="font-semibold text-foreground">Téléphone :</span> <a href="tel:+2252720123456" className="hover:text-primary transition-colors">+225 27 20 12 34 56</a></p>
          <p><span className="font-semibold text-foreground">Email :</span> <a href="mailto:contact@paradis-alimentaire.ci" className="hover:text-primary transition-colors">contact@paradis-alimentaire.ci</a></p>
          <p><span className="font-semibold text-foreground">WhatsApp :</span> <a href="https://wa.me/2250707123456" className="hover:text-primary transition-colors">+225 07 07 12 34 56</a></p>
          <p><span className="font-semibold text-foreground">Horaires d'ouverture :</span> Lundi au Samedi, 8h00 - 19h00</p>
        </div>
      )
    },
    {
      icon: Globe,
      title: "Hébergement",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p><span className="font-semibold text-foreground">Hébergeur :</span> Vercel Inc.</p>
          <p><span className="font-semibold text-foreground">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
          <p><span className="font-semibold text-foreground">Téléphone :</span> +1 (559) 288-7060</p>
          <p><span className="font-semibold text-foreground">Site web :</span> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a></p>
        </div>
      )
    },
    {
      icon: Shield,
      title: "Directeur de publication",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p><span className="font-semibold text-foreground">Nom :</span> Koné Ibrahim</p>
          <p><span className="font-semibold text-foreground">Fonction :</span> Directeur Général</p>
          <p><span className="font-semibold text-foreground">Email :</span> <a href="mailto:direction@paradis-alimentaire.ci" className="hover:text-primary transition-colors">direction@paradis-alimentaire.ci</a></p>
        </div>
      )
    },
    {
      icon: Scale,
      title: "Propriété intellectuelle",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>L'ensemble des éléments composant le site Paradis Alimentaire (textes, images, logos, vidéos, structure, etc.) sont protégés par les lois sur la propriété intellectuelle.</p>
          <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Paradis Alimentaire.</p>
          <p>Les marques, logos et noms commerciaux mentionnés sur ce site sont la propriété exclusive de Paradis Alimentaire.</p>
        </div>
      )
    },
    {
      icon: FileCheck,
      title: "Responsabilité",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Paradis Alimentaire s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site. Cependant, l'entreprise ne peut garantir l'exhaustivité ou l'absence de modification par un tiers (intrusion, virus).</p>
          <p>Paradis Alimentaire décline toute responsabilité en cas de dommages directs ou indirects liés à l'utilisation du site ou des informations qu'il contient.</p>
          <p>Les liens hypertextes présents sur le site renvoyant vers d'autres ressources ne sauraient engager la responsabilité de Paradis Alimentaire.</p>
        </div>
      )
    },
    {
      icon: Lock,
      title: "Protection des données personnelles (RGPD)",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel en Côte d'Ivoire, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification de vos données</li>
            <li>Droit à l'effacement de vos données</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          <p className="mt-3">Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) à l'adresse : <a href="mailto:dpo@paradis-alimentaire.ci" className="text-primary hover:underline">dpo@paradis-alimentaire.ci</a></p>
        </div>
      )
    },
    {
      icon: Eye,
      title: "Cookies",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Le site Paradis Alimentaire utilise des cookies pour améliorer votre expérience de navigation, analyser le trafic et personnaliser le contenu.</p>
          <p>Vous pouvez à tout moment paramétrer ou refuser les cookies via les paramètres de votre navigateur.</p>
          <p>Les cookies que nous utilisons ne stockent pas d'informations personnelles sensibles.</p>
        </div>
      )
    },
    {
      icon: Users,
      title: "Conditions générales de vente (CGV)",
      content: (
        <div className="space-y-3 text-muted-foreground">
          <p>Les présentes conditions générales de vente régissent les relations contractuelles entre Paradis Alimentaire et ses clients.</p>
          <p>En passant commande sur notre site, vous acceptez sans réserve nos conditions générales de vente.</p>
          <Button variant="link" className="px-0 text-primary" asChild>
            <Link href="/cgv">Consulter nos CGV complètes →</Link>
          </Button>
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
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Mentions Légales
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conformément aux dispositions des articles 6-III et 19 de la loi pour la Confiance dans l'Économie Numérique, 
            nous vous informons des éléments suivants.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Dernière mise à jour : {currentYear}
          </p>
        </div>

        {/* Introduction Card */}
        <Card className="border-none shadow-lg bg-primary/5 mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Le site <span className="font-semibold text-foreground">paradis-alimentaires.vercel.app</span> (ci-après "le Site") 
              est édité par Paradis Alimentaire, société spécialisée dans la vente de produits alimentaires de qualité.
            </p>
          </CardContent>
        </Card>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Information sur les litiges */}
        <Card className="border-none shadow-lg mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Règlement des litiges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              En cas de litige relatif à l'interprétation ou à l'exécution des présentes mentions légales, 
              une solution amiable sera recherchée avant toute action judiciaire.
            </p>
            <p>
              À défaut d'accord amiable, tout litige sera soumis aux tribunaux compétents d'Abidjan, 
              Côte d'Ivoire, conformément aux règles de compétence territoriale.
            </p>
            <p className="text-sm mt-4">
              Conformément aux articles L.616-1 et R.616-1 du code de la consommation, 
              nous proposons un dispositif de médiation de la consommation.
            </p>
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
