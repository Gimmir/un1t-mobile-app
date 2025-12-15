import { useFetch, useMutate, usePaginatedFetch } from '@/src/hooks/useFetch';
import { queryClient } from '@/src/lib/query-client';
import { Order, PaginatedResponse } from '@/src/types/api';
import { ordersApi } from '../api/orders.api';

/**
 * Hook for fetching paginated orders
 * 
 * @example
 * const { data, isLoading, error } = useOrders(1);
 */
export function useOrders(page: number = 1, limit: number = 10) {
  return usePaginatedFetch<PaginatedResponse<Order>>(
    ['orders', page, limit],
    () => ordersApi.getOrders(page, limit),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
}

/**
 * Hook for fetching a single order by ID
 * 
 * @example
 * const { data: order, isLoading } = useOrder(orderId);
 */
export function useOrder(orderId: string) {
  return useFetch<Order>(
    ['orders', orderId],
    () => ordersApi.getOrderById(orderId),
    {
      enabled: !!orderId,
    }
  );
}

/**
 * Hook for creating a new order
 * 
 * @example
 * const { mutate: createOrder, isPending } = useCreateOrder();
 */
export function useCreateOrder() {
  return useMutate<Order, Error, Partial<Order>>(
    (orderData) => ordersApi.createOrder(orderData),
    {
      onSuccess: () => {
        // Invalidate orders list to refetch
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
    }
  );
}

/**
 * Hook for canceling an order
 */
export function useCancelOrder() {
  return useMutate<Order, Error, string>(
    (orderId) => ordersApi.cancelOrder(orderId),
    {
      onSuccess: (data, orderId) => {
        // Invalidate both the orders list and the specific order
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      },
    }
  );
}
