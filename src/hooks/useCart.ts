import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';
import type { CartResponse } from '@/types/api';

export function useCart() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get<CartResponse>(ENDPOINTS.CART);
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post(ENDPOINTS.CART, { productId });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t.products.addedToCart);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
      const res = await api.put(ENDPOINTS.CART_ITEM(productId), { count });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t.cart.quantityUpdated);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete(ENDPOINTS.CART_ITEM(productId));
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t.cart.itemRemoved);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete(ENDPOINTS.CART_CLEAR);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t.cart.cartCleared);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useApplyCoupon() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (couponName: string) => {
      const res = await api.put(ENDPOINTS.CART_COUPON, { couponName });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t.cart.couponApplied);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}
