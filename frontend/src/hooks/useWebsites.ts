import { useQueryClient } from '@tanstack/react-query'
import { useApiMutation, useApiQuery } from './useApi'
import { useToast } from '../components/ui/toaster'

export const WEBSITES_QUERY_KEY = 'websites'

export interface Website {
  id: string
  name: string
  url: string
  createdAt: string
  updatedAt: string
}

export function useWebsites(query: any = {}) {
  const params = new URLSearchParams(query)
  return useApiQuery<{ data: { data: Website[] } }>(
    [WEBSITES_QUERY_KEY] as const,
    `/websites?${params.toString()}`
  )
}

export function useWebsite(id: string) {
  return useApiQuery<{ data: { data: Website } }>(
    [WEBSITES_QUERY_KEY, { id }] as const,
    `/websites/${id}`
  )
}

export function useCreateWebsite() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<
    Website,
    Omit<Website, 'id' | 'createdAt' | 'updatedAt'>
  >('/websites', 'post', {
    onSuccess: () => {
      toast({ title: 'Website created', variant: 'success' })
      qc.invalidateQueries({ queryKey: [WEBSITES_QUERY_KEY] })
    },
    onError: (err: any) => {
      toast({
        title: 'Failed to create website',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}

export function useUpdateWebsite() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<Website, Partial<Website> & { id: string }>(
    (v) => `/websites/${v.id}`,
    'put',
    {
      onSuccess: (_, v) => {
        toast({ title: 'Website updated', variant: 'success' })
        qc.invalidateQueries({ queryKey: [WEBSITES_QUERY_KEY] })
        qc.invalidateQueries({ queryKey: [WEBSITES_QUERY_KEY, { id: v.id }] })
      },
      onError: (err: any) => {
        toast({
          title: 'Failed to update website',
          description: err?.message,
          variant: 'error'
        })
      }
    }
  )
}

export function useDeleteWebsite() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<void, { ids: string[] }>('/websites', 'delete', {
    onSuccess: () => {
      toast({ title: 'Website deleted', variant: 'success' })
      qc.invalidateQueries({ queryKey: [WEBSITES_QUERY_KEY] })
    },
    onError: (err: any) => {
      toast({
        title: 'Failed to delete website',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}
