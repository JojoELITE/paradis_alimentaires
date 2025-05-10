import Link from "next/link"
import { Button } from "@/components/ui/button"
import MoyensPaiement from "@/components/moyens-paiement"

export default function PaymentMethodsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Moyens de Paiement</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les différentes méthodes de paiement disponibles pour vos achats sur Paradis Alimentaire
          </p>
        </div>

        <MoyensPaiement />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Comment ça marche ?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choisissez vos produits</h3>
              <p className="text-muted-foreground">
                Parcourez notre catalogue et ajoutez les produits que vous souhaitez acheter à votre panier.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Passez à la caisse</h3>
              <p className="text-muted-foreground">
                Vérifiez votre panier et procédez au paiement en choisissant votre méthode de paiement préférée.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Recevez votre commande</h3>
              <p className="text-muted-foreground">
                Après confirmation de votre paiement, nous préparons et livrons votre commande à l'adresse indiquée.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quels sont les délais de paiement ?</h3>
                <p className="text-muted-foreground">
                  Les paiements par carte bancaire et Mobile Money sont traités immédiatement. Pour les virements
                  bancaires, le délai peut varier de 1 à 3 jours ouvrables.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Comment fonctionne le paiement à la livraison ?</h3>
                <p className="text-muted-foreground">
                  Lors de la livraison, notre livreur vous remettra votre commande et vous pourrez payer en espèces.
                  Assurez-vous d'avoir le montant exact pour faciliter la transaction.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Les paiements sont-ils sécurisés ?</h3>
                <p className="text-muted-foreground">
                  Oui, tous les paiements effectués sur notre site sont sécurisés. Nous utilisons des protocoles de
                  cryptage avancés pour protéger vos informations personnelles et bancaires.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Puis-je changer de méthode de paiement après avoir passé ma commande ?
                </h3>
                <p className="text-muted-foreground">
                  Une fois la commande confirmée, il n'est généralement pas possible de changer de méthode de paiement.
                  Veuillez nous contacter rapidement si vous avez besoin de modifier votre méthode de paiement.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à commander ?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Découvrez notre sélection de produits frais et de qualité, et profitez de nos différentes méthodes de
              paiement pour une expérience d'achat flexible.
            </p>
            <Link href="/produits">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
