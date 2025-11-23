import { useMutation } from '@tanstack/react-query'
import { apiClient } from '../lib/apiClient'
import { useToast } from '../components/ui/toaster'

export interface DetectedField {
  name: string
  type?: string
  label?: string
  placeholder?: string
  required?: boolean
}

export interface DetectedForm {
  name: string
  action?: string
  method?: string
  selector?: string
  fields: DetectedField[]
}

export function useDetectForms() {
  const { toast } = useToast()

  return useMutation<
    { data: DetectedForm[] },
    unknown,
    { url?: string; html?: string }
  >({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post('/websites/detect-forms', payload)
      return data
    },
    onError: (err: any) => {
      toast({
        title: 'Failed to detect forms',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}
