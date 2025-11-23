import { useQueryClient } from '@tanstack/react-query'
import { useApiMutation, useApiQuery } from './useApi'
import { useToast } from '../components/ui/toaster'

export const LEADS_QUERY_KEY = 'leads'

export interface Lead {
  id: string
  websiteId: string
  formId: string
  data: Record<string, unknown>
  meta?: Record<string, unknown>
}

export interface LeadsListResponse {
  data: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function useLeads(params?: {
  websiteId?: string
  formId?: string
  page?: number
  limit?: number
  search?: string
  field?: string
  isPagination?: boolean
}) {
  const queryParams = params ?? {}
  return useApiQuery<LeadsListResponse>(
    [LEADS_QUERY_KEY, queryParams] as const,
    '/leads',
    queryParams
  )
}

export function useLead(id: string) {
  return useApiQuery<Lead>([LEADS_QUERY_KEY, { id }] as const, `/leads/${id}`)
}

export function useCreateLead() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<
    Lead,
    {
      websiteId: string
      formId: string
      data: Record<string, unknown>
      meta?: Record<string, unknown>
    }
  >('/leads', 'post', {
    onSuccess: (data) => {
      toast({ title: 'Lead created', variant: 'success' })
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] })
      qc.invalidateQueries({
        queryKey: [LEADS_QUERY_KEY, { websiteId: data.websiteId }]
      })
    },
    onError: (err: any) => {
      toast({
        title: 'Failed to create lead',
        description: err?.message,
        variant: 'error'
      })
    }
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<Lead, Partial<Lead> & { id: string }>(
    (v) => `/leads/${v.id}`,
    'put',
    {
      onSuccess: (data) => {
        toast({ title: 'Lead updated', variant: 'success' })
        qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] })
        qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY, { id: data.id }] })
      },
      onError: (err: any) => {
        toast({
          title: 'Failed to update lead',
          description: err?.message,
          variant: 'error'
        })
      }
    }
  )
}

export function useDeleteLead() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useApiMutation<void, { id: string; websiteId?: string }>(
    (v) => `/leads/${v.id}`,
    'delete',
    {
      onSuccess: (_, vars) => {
        toast({ title: 'Lead deleted', variant: 'success' })
        qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] })
        if (vars.websiteId) {
          qc.invalidateQueries({
            queryKey: [LEADS_QUERY_KEY, { websiteId: vars.websiteId }]
          })
        }
      },
      onError: (err: any) => {
        toast({
          title: 'Failed to delete lead',
          description: err?.message,
          variant: 'error'
        })
      }
    }
  )
}
