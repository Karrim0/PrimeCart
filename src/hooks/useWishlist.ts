import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';
import type { WishlistResponse } from '@/types/api';

export function useWishlist() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get<WishlistResponse>(ENDPOINTS.WISHLIST);
      return res.data;
    },
    enabled: isAuthenticated,
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.post(ENDPOINTS.WISHLIST, { productId });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(t.products.addedToWishlist);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete(ENDPOINTS.WISHLIST_ITEM(productId));
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success(t.products.removedFromWishlist);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}
