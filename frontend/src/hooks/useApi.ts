import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { apiClient } from '../lib/apiClient'

export type QueryKey = readonly [string, Record<string, unknown>?]

export function useApiQuery<TData = unknown, TError = AxiosError>(
  queryKey: QueryKey,
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<TData>(url, { params })
      return data
    },
    ...options
  })
}

export function useApiMutation<
  TData = unknown,
  TVariables = unknown,
  TError = AxiosError
>(
  url: string | ((variables: TVariables) => string),
  method: 'post' | 'put' | 'delete' | 'patch' = 'post',
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      const endpoint = typeof url === 'function' ? url(variables) : url
      const { data } = await apiClient.request<TData>({
        url: endpoint,
        method,
        data: variables
      })
      return data
    },
    ...options
  })
}
