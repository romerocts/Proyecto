"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación al montar el componente
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const auth = localStorage.getItem("hardware-store-auth")
          if (auth === "true") {
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Pequeño delay para evitar hydration mismatch
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [])

  const login = (email: string, password: string) => {
    if (email === "ferreteria@araque.com" && password === "admin") {
      setIsAuthenticated(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("hardware-store-auth", "true")
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("hardware-store-auth")
    }
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
