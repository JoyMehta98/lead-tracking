import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { useToast } from '../components/ui/toaster'

export const WEBSITE_FORMS_QUERY_KEY = 'websiteForms'

export interface FormField {
  id?: string
  name: string
  label?: string
  type?: string
  required?: boolean
  placeholder?: string
}

export interface DetectedForm {
  id?: string
  name: string
  url?: string
  action?: string
  method?: string
  fields?: FormField[]
}

export function useWebsiteForms(websiteId?: string) {
  return useQuery<{ data: DetectedForm[] }>({
    queryKey: [WEBSITE_FORMS_QUERY_KEY, websiteId],
    queryFn: async () => {
      if (!websiteId) return { data: [] }
      const { data } = await apiClient.get(`/websites/${websiteId}/forms`)
      return { data: data?.data ?? [] }
    },
    enabled: !!websiteId
  })
}

export function useScanWebsite(websiteId?: string) {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation<{ data?: any }, unknown, void>({
    mutationFn: async () => {
      if (!websiteId) throw new Error('Website ID is required')
      const { data } = await apiClient.post(`/websites/${websiteId}/scan`)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [WEBSITE_FORMS_QUERY_KEY, websiteId] })
      toast({
        title: 'Scan started',
        description: 'Scanning website for forms',
        variant: 'success'
      })
    },
    onError: (err: any) => {
      toast({
        title: 'Failed to scan website',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}

export function useSaveWebsiteForms(websiteId?: string) {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation<{ success: boolean }, unknown, { forms: DetectedForm[] }>({
    mutationFn: async (payload) => {
      if (!websiteId) throw new Error('Website ID is required')
      const { data } = await apiClient.post(
        `/websites/${websiteId}/forms`,
        payload
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [WEBSITE_FORMS_QUERY_KEY, websiteId] })
      toast({ title: 'Forms saved', variant: 'success' })
    },
    onError: (err: any) => {
      toast({
        title: 'Failed to save forms',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}
