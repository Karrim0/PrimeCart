import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';
import type { AddressesResponse } from '@/types/api';

export function useAddresses() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get<AddressesResponse>(ENDPOINTS.ADDRESSES);
      return res.data.data;
    },
    enabled: isAuthenticated,
  });
}

export function useAddAddress() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (data: { name: string; details: string; phone: string; city: string }) => {
      const res = await api.post(ENDPOINTS.ADDRESSES, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(t.addresses.addressAdded);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useRemoveAddress() {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (addressId: string) => {
      const res = await api.delete(ENDPOINTS.ADDRESS(addressId));
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      toast.success(t.addresses.addressRemoved);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}
