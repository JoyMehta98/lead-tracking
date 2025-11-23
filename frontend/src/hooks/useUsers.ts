import { useQueryClient } from '@tanstack/react-query'
import { useApiMutation, useApiQuery } from './useApi'
import { useToast } from '../components/ui/toaster'

export const USERS_QUERY_KEY = 'users'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export function useUsers() {
  return useApiQuery<User[]>([USERS_QUERY_KEY] as const, '/users')
}

export function useUser(id: string) {
  return useApiQuery<User>([USERS_QUERY_KEY, { id }] as const, `/users/${id}`)
}

export function useCreateUser() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<User, Omit<User, 'id' | 'createdAt' | 'updatedAt'>>(
    '/users',
    'post',
    {
      onSuccess: () => {
        toast({ title: 'User created', variant: 'success' })
        qc.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      },
      onError: (err: any) => {
        toast({
          title: 'Failed to create user',
          description: err?.message,
          variant: 'error'
        })
      }
    }
  )
}

export function useUpdateUser() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<User, Partial<User> & { id: string }>(
    (v) => `/users/${v.id}`,
    'put',
    {
      onSuccess: (_, v) => {
        toast({ title: 'User updated', variant: 'success' })
        qc.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
        qc.invalidateQueries({ queryKey: [USERS_QUERY_KEY, { id: v.id }] })
      },
      onError: (err: any) => {
        toast({
          title: 'Failed to update user',
          description: err?.message,
          variant: 'error'
        })
      }
    }
  )
}

export function useDeleteUser() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<void, { id: string }>(
    (v) => `/users/${v.id}`,
    'delete',
    {
      onSuccess: () => {
        toast({ title: 'User deleted', variant: 'success' })
        qc.invalidateQueries({ queryKey: [USERS_QUERY_KEY] })
      },
      onError: (err: any) => {
        toast({
          title: 'Failed to delete user',
          description: err?.message,
          variant: 'error'
        })
      }
    }
  )
}
