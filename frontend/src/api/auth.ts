// src/api/authService.ts
import { api } from './config'

interface LoginCredentials {
  email: string
  password: string
}

interface SignupData extends LoginCredentials {
  name: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async signup(userData: SignupData) {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },

  async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('authToken')
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}
