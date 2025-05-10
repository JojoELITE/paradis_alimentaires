"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface FavoriteItem {
  id: number
  name: string
  price: number
  image: string
  category: string
}

interface FavoritesContextType {
  items: FavoriteItem[]
  addItem: (item: FavoriteItem) => void
  removeItem: (id: number) => void
  isFavorite: (id: number) => boolean
  totalItems: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<FavoriteItem[]>([])

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      try {
        setItems(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
        setItems([])
      }
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(items))
  }, [items])

  const addItem = (item: FavoriteItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        return prevItems
      }

      return [...prevItems, item]
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isFavorite = (id: number) => {
    return items.some((item) => item.id === id)
  }

  const totalItems = items.length

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isFavorite,
        totalItems,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)

  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }

  return context
}
