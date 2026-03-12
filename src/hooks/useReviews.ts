import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";
import { toast } from "sonner";
import { useI18n } from "@/i18n/I18nProvider";
import type { Review, ApiResponse } from "@/types/api";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Review[]>>(
        ENDPOINTS.PRODUCT_REVIEWS(productId),
      );
      return res.data.data;
    },
    enabled: !!productId,
  });
}

export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  const { t } = useI18n();
  return useMutation({
    mutationFn: async (data: { title: string; ratings: number }) => {
      const res = await api.post(ENDPOINTS.PRODUCT_REVIEWS(productId), data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
      toast.success(t.reviews.reviewSubmitted);
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || t.common.error),
  });
}
