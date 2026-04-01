import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"



export default function MoyensPaiement() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Moyens de Paiement</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nous acceptons plusieurs méthodes de paiement pour vous offrir une expérience d'achat flexible et sécurisée
          </p>
        </div>


        <div className="mt-10 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Paiement sécurisé</h3>
          <p className="text-muted-foreground mb-4">
            Toutes vos transactions sont sécurisées. Nous utilisons les dernières technologies de cryptage pour protéger
            vos informations de paiement.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-medium">SSL</span>
            </div>
            <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-medium">3D Secure</span>
            </div>
            <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-medium">PCI DSS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
