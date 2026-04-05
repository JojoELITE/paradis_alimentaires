import type { HttpContext } from '@adonisjs/core/http'
import Subscriber from '#models/subscriber'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

export default class NewsletterController {
  async store({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      if (!email || !email.match(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)) {
        return response.status(400).json({
          success: false,
          message: 'Adresse email invalide',
        })
      }

      // Vérifier si l'email existe déjà
      const existing = await Subscriber.findBy('email', email)

      if (existing) {
        if (existing.is_active) {
          return response.status(400).json({
            success: false,
            message: 'Cet email est déjà inscrit à notre newsletter',
          })
        } else {
          // Réactiver l'abonnement
          existing.is_active = true
          existing.unsubscribed_at = null
          existing.subscribed_at = DateTime.now()
          await existing.save()

          return response.json({
            success: true,
            message: 'Votre abonnement a été réactivé avec succès',
          })
        }
      }

      // Créer un nouvel abonné
      await Subscriber.create({
        id: randomUUID(),
        email,
        is_active: true,
        subscribed_at: DateTime.now(),
      })

      return response.status(201).json({
        success: true,
        message: 'Inscription réussie à la newsletter',
      })
    } catch (error) {
      console.error('Newsletter error:', error)
      return response.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'inscription',
      })
    }
  }

  async unsubscribe({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])

      const subscriber = await Subscriber.findBy('email', email)

      if (!subscriber) {
        return response.status(404).json({
          success: false,
          message: 'Email non trouvé',
        })
      }

      subscriber.is_active = false
      subscriber.unsubscribed_at = DateTime.now()
      await subscriber.save()

      return response.json({
        success: true,
        message: 'Vous avez été désinscrit de la newsletter',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la désinscription',
      })
    }
  }
}
