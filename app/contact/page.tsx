"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import Banner from "@/components/banner"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Banner Section */}
        <div className="mb-16">
          <Banner
            title="Contactez-nous"
            description="Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande d'information."
            buttonText="Nos produits"
            buttonLink="/produits"
            image="/images/hero2.jpeg"
            bgColor="bg-logo-green"
            position="right"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6">Informations de contact</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Adresse</h3>
                    <p className="text-muted-foreground mt-1">
                      123 Avenue des Champs-Élysées
                      <br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Téléphone</h3>
                    <p className="text-muted-foreground mt-1">+33 1 23 45 67 89</p>
                    <p className="text-muted-foreground">+33 9 87 65 43 21</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground mt-1">contact@paradisalimentaire.fr</p>
                    <p className="text-muted-foreground">support@paradisalimentaire.fr</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Heures d'ouverture</h3>
                    <p className="text-muted-foreground mt-1">Lundi - Vendredi: 8h00 - 20h00</p>
                    <p className="text-muted-foreground">Samedi: 9h00 - 18h00</p>
                    <p className="text-muted-foreground">Dimanche: Fermé</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-100 rounded-lg p-6">
                <h3 className="font-medium mb-2">Service client</h3>
                <p className="text-sm text-muted-foreground">
                  Notre équipe de service client est disponible pour vous aider du lundi au vendredi de 8h00 à 20h00.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6">Envoyez-nous un message</h2>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Message envoyé avec succès!</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Merci de nous avoir contacté. Nous avons bien reçu votre message et nous vous répondrons dans les
                    plus brefs délais.
                  </p>
                  <Button className="mt-6 bg-primary hover:bg-primary/90" onClick={() => setIsSuccess(false)}>
                    Envoyer un autre message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="mt-1 min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Map */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6">Notre emplacement</h2>
              <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden">
                {/* Replace with actual map component */}
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <p className="text-gray-600">Carte Google Maps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
