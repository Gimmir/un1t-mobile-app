import {
    QueryKey,
    useMutation,
    UseMutationOptions,
    useQuery,
    UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Generic hook for GET requests using TanStack Query
 * 
 * @param queryKey - Unique identifier for this query
 * @param queryFn - Function that returns a Promise with the data
 * @param options - Additional TanStack Query options
 * 
 * @example
 * const { data, isLoading, error } = useFetch(
 *   ['users', userId],
 *   () => api.get<User>(`/users/${userId}`),
 *   { enabled: !!userId }
 * );
 */
export function useFetch<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * Generic hook for POST/PUT/PATCH/DELETE requests using TanStack Query
 * 
 * @param mutationFn - Function that performs the mutation
 * @param options - Additional TanStack Query mutation options
 * 
 * @example
 * const { mutate, isPending } = useMutate(
 *   (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
 *   {
 *     onSuccess: (data) => {
 *       console.log('Login successful', data);
 *     },
 *     onError: (error) => {
 *       console.error('Login failed', error);
 *     }
 *   }
 * );
 */
export function useMutate<TData = unknown, TError = AxiosError, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}

/**
 * Type-safe hook for paginated data fetching
 * 
 * @example
 * const { data, isLoading } = usePaginatedFetch(
 *   ['orders', page],
 *   () => api.get<PaginatedResponse<Order>>(`/orders?page=${page}`),
 * );
 */
export function usePaginatedFetch<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    ...options,
  });
}
