// hooks/use-cart.ts
"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
}

export interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setItems: (items: CartItem[]) => void   // ← ajouté
  subtotal: number
  totalItems: number
}

// ─── Contexte ─────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<CartItem[]>([])

  // Hydratation depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart")
      if (stored) setItemsState(JSON.parse(stored))
    } catch {
      // localStorage indisponible (SSR ou erreur)
    }
  }, [])

  // Persistance dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch {
      // silencieux
    }
  }, [items])

  // ── Actions ──────────────────────────────────────────────────────────────────

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItemsState((prev) => {
        const existing = prev.find((i) => i.id === newItem.id)
        if (existing) {
          return prev.map((i) =>
            i.id === newItem.id
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i
          )
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }]
      })
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    setItemsState((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItemsState((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItemsState((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItemsState([])
  }, [])

  // setItems : remplace tout le panier (utilisé pour charger depuis le backend)
  const setItems = useCallback((newItems: CartItem[]) => {
    setItemsState(newItems)
  }, [])

  // ── Calculs ──────────────────────────────────────────────────────────────────

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setItems,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart doit être utilisé dans un <CartProvider>")
  }
  return context
}
