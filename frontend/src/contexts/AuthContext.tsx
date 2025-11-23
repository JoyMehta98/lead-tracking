// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { authService } from '../api/auth'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    const userData = {
      id: response.userId, // Adjust based on your API response
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const register = async (name: string, email: string, password: string) => {
    await authService.signup({ name, email, password })
    await login(email, password) // Login after successful registration
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
