import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Product, ApiResponse, ProductsQueryParams, Category, Subcategory, Brand } from '@/types/api';

export function useProducts(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>(ENDPOINTS.PRODUCTS, { params });
      return res.data;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get<{ data: Product }>(ENDPOINTS.PRODUCT(id));
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Category[]>>(ENDPOINTS.CATEGORIES);
      return res.data.data;
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const res = await api.get<{ data: Category }>(ENDPOINTS.CATEGORY(id));
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCategorySubcategories(id: string) {
  return useQuery({
    queryKey: ['category-subcategories', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Subcategory[]>>(ENDPOINTS.CATEGORY_SUBCATEGORIES(id));
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Brand[]>>(ENDPOINTS.BRANDS);
      return res.data.data;
    },
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: async () => {
      const res = await api.get<{ data: Brand }>(ENDPOINTS.BRAND(id));
      return res.data.data;
    },
    enabled: !!id,
  });
}
