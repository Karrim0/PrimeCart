import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';
import type { Order } from '@/types/api';

export function useOrders() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get<Order[]>(ENDPOINTS.ORDERS);
      // The API may return array directly or wrapped
      return Array.isArray(res.data) ? res.data : (res.data as any).data || [];
    },
    enabled: isAuthenticated,
  });
}

export function useCashOrder() {
  const { t } = useI18n();
  return useMutation({
    mutationFn: async ({ cartId, shippingAddress }: { cartId: string; shippingAddress: { details: string; phone: string; city: string } }) => {
      const res = await api.post(ENDPOINTS.CASH_ORDER(cartId), { shippingAddress });
      return res.data;
    },
    onSuccess: () => toast.success(t.checkout.orderPlaced),
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useCheckoutSession() {
  const { t } = useI18n();
  return useMutation({
    mutationFn: async ({ cartId, shippingAddress }: { cartId: string; shippingAddress: { details: string; phone: string; city: string } }) => {
      const res = await api.post(`${ENDPOINTS.CHECKOUT_SESSION(cartId)}?url=${window.location.origin}`, { shippingAddress });
      return res.data;
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}
