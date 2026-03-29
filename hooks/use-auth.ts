// hooks/use-auth.ts
import { useState, useEffect } from "react"

interface User {
  id: string  // Changé: id -> uuid
  email: string
  full_name?: string  // Changé: name -> full_name pour correspondre à votre modèle
  role?: 'marchant' | 'admin' | 'client'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAuth = async () => {
      setIsLoading(true)
      
      try {
        // Récupérer depuis localStorage
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        console.log("useAuth: Chargement de l'auth depuis localStorage", { storedUser, storedToken })
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser)
          setUser({
            id : userData.id,
            email: userData.email,
            full_name: userData.full_name || userData.name,
            role: userData.role
          })
          setToken(storedToken)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuth()
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser({
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      role: userData.role
    })
    setToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  return { 
    user, 
    token, 
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  }
}