"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Send, CheckCircle2 } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      toast({
        title: "Inscription réussie !",
        description: "Merci de vous être inscrit à notre newsletter.",
      })
    }, 1500)
  }

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="mb-8 text-white/90">
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives, nos nouveautés et nos conseils
            culinaires
          </p>

          {isSubscribed ? (
            <div className="flex flex-col items-center justify-center space-y-4 bg-white/10 rounded-lg p-8">
              <CheckCircle2 className="h-16 w-16 text-green-400" />
              <h3 className="text-xl font-semibold">Merci pour votre inscription !</h3>
              <p>Vous recevrez bientôt nos meilleures offres et actualités.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 pr-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="bg-white text-primary hover:bg-white/90 h-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Inscription...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    S'inscrire
                    <Send className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          )}

          <p className="mt-4 text-sm text-white/70">
            En vous inscrivant, vous acceptez de recevoir nos emails et confirmez avoir lu notre politique de
            confidentialité.
          </p>
        </div>
      </div>
    </section>
  )
}
