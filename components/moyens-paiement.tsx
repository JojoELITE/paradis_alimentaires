import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const paymentMethods = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Paiement sécurisé par carte bancaire (Visa, Mastercard, etc.)",
    icon: "/images/visa-mastercard.png",
    logos: ["/images/visa.png", "/images/mastercard.png"],
  },
  {
    id: "mobile",
    name: "Mobile Money",
    description: "Paiement via Orange Money, MTN Mobile Money, Moov Money, etc.",
    icon: "/images/mobile-money.png",
    logos: ["/images/orange-money.png", "/images/mtn-money.png", "/images/moov-money.png"],
  },
  {
    id: "cash",
    name: "Paiement à la livraison",
    description: "Payez en espèces à la réception de votre commande",
    icon: "/images/cash.png",
    logos: [],
  },
  {
    id: "transfer",
    name: "Virement bancaire",
    description: "Effectuez un virement bancaire sur notre compte",
    icon: "/images/bank-transfer.png",
    logos: [],
  },
]

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <div className="relative h-8 w-8">
                      <Image
                        src={method.icon || "/placeholder.svg?height=32&width=32"}
                        alt={method.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>

                  {method.logos.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mt-auto">
                      {method.logos.map((logo, index) => (
                        <div key={index} className="relative h-8 w-12">
                          <Image
                            src={logo || "/placeholder.svg?height=32&width=48"}
                            alt={`${method.name} logo ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
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
