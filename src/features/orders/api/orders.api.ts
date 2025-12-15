import { api } from '@/src/lib/axios';
import { Order, PaginatedResponse } from '@/src/types/api';

/**
 * Orders API endpoints
 */
export const ordersApi = {
  /**
   * Get user's orders with pagination
   */
  getOrders: (page: number = 1, limit: number = 10) => 
    api.get<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`),

  /**
   * Get single order by ID
   */
  getOrderById: (orderId: string) => 
    api.get<Order>(`/orders/${orderId}`),

  /**
   * Create new order
   */
  createOrder: (orderData: Partial<Order>) => 
    api.post<Order>('/orders', orderData),

  /**
   * Cancel order
   */
  cancelOrder: (orderId: string) => 
    api.patch<Order>(`/orders/${orderId}/cancel`),
};
