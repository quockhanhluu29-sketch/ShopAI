import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().min(1),
  category: z.string().default('Khác'),
  price: z.number().nonnegative(),
  rating: z.number().min(0).max(5).default(4.5),
  image: z.string().url(),
  description: z.string().default(''),
  inventory: z.number().int().nonnegative().default(0),
});

export const ProductListSchema = z.array(ProductSchema);
export type Product = z.infer<typeof ProductSchema>;