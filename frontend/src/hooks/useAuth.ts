import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'
import type { User } from './useUsers'
import { useToast } from '../components/ui/toaster'

const AUTH_QUERY_KEY = 'auth'

type LoginCredentials = { email: string; password: string }

type AuthResponse = { token: string; user: User }

export function useLogin() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation<AuthResponse, any, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials
      )
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      qc.setQueryData([AUTH_QUERY_KEY, 'me'], data.user)
      toast({ title: 'Logged in', variant: 'success' })
      navigate('/')
    },
    onError: (err: any) => {
      toast({
        title: 'Login failed',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}

export function useLogout() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout')
    },
    onSuccess: () => {
      localStorage.removeItem('token')
      qc.clear()
      toast({ title: 'Logged out', variant: 'success' })
      navigate('/login')
    }
  })
}

export function useAuthUser() {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY, 'me'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/me')
      return data
    },
    enabled: !!localStorage.getItem('token')
  })
}

export function useRegister() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation<
    AuthResponse,
    any,
    Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  >({
    mutationFn: async (userData) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/register',
        userData
      )
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      qc.setQueryData([AUTH_QUERY_KEY, 'me'], data.user)
      toast({ title: 'Account created', variant: 'success' })
      navigate('/')
    },
    onError: (err: any) => {
      toast({
        title: 'Registration failed',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}
