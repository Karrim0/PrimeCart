import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nProvider';
import type { AuthResponse } from '@/types/api';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post<AuthResponse>(ENDPOINTS.SIGNIN, data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success(t.auth.loginSuccess);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t.common.error);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; rePassword: string; phone: string }) => {
      const res = await api.post<AuthResponse>(ENDPOINTS.SIGNUP, data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success(t.auth.registerSuccess);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t.common.error);
    },
  });
}

export function useForgotPassword() {
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await api.post(ENDPOINTS.FORGOT_PASSWORD, data);
      return res.data;
    },
    onSuccess: () => toast.success(t.auth.codeSent),
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useVerifyResetCode() {
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (data: { resetCode: string }) => {
      const res = await api.post(ENDPOINTS.VERIFY_RESET_CODE, data);
      return res.data;
    },
    onSuccess: () => toast.success(t.auth.codeVerified),
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useResetPassword() {
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (data: { email: string; newPassword: string }) => {
      const res = await api.put(ENDPOINTS.RESET_PASSWORD, data);
      return res.data;
    },
    onSuccess: () => toast.success(t.auth.resetSuccess),
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useChangePassword() {
  const { t } = useI18n();
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: async (data: { currentPassword: string; password: string; rePassword: string }) => {
      const res = await api.put(ENDPOINTS.CHANGE_PASSWORD, data);
      return res.data;
    },
    onSuccess: (data: any) => {
      if (data.token && data.user) setAuth(data.token, data.user);
      toast.success(t.account.passwordChanged);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}

export function useUpdateProfile() {
  const { t } = useI18n();
  const { updateUser } = useAuthStore();
  return useMutation({
    mutationFn: async (data: { name?: string; email?: string; phone?: string }) => {
      const res = await api.put(ENDPOINTS.UPDATE_ME, data);
      return res.data;
    },
    onSuccess: (data: any) => {
      if (data.user) updateUser(data.user);
      toast.success(t.account.profileUpdated);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t.common.error),
  });
}
