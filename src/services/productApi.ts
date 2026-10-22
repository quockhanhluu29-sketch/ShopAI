import { API_ENDPOINTS } from '@constants/api';
import axiosClient from '@api/axiosClient';
import { recordNonFatal } from '@services/crashReporter';
import { ProductListSchema, ProductSchema } from '../types/product.schema';
import type { Product } from '../types/product.schema';

export interface ProductPage {
  items: Product[];
  nextPage: number | null;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await axiosClient.get(API_ENDPOINTS.products);
  const rawItems = Array.isArray(data) ? data : data.items;
  return ProductListSchema.parse(rawItems);
};

export const fetchProductsPage = async (page: number): Promise<ProductPage> => {
  try {
    const { data } = await axiosClient.get(API_ENDPOINTS.products, { params: { page, limit: 10 } });
    if (Array.isArray(data)) {
      const items = ProductListSchema.parse(data);
      return { items, nextPage: null };
    }

    const items = ProductListSchema.parse(data.items);
    return { items, nextPage: data.nextPage ?? null };
  } catch (error) {
    recordNonFatal('ProductFetchFailed', error, { page: String(page) });
    throw error;
  }
};

export const fetchProductById = async (productId: string): Promise<Product> => {
  const { data } = await axiosClient.get(`${API_ENDPOINTS.products}/${productId}`);
  return ProductSchema.parse(data);
};