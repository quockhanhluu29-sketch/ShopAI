import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchProductsPage } from '@services/productApi';

export const useProducts = () => {
  const query = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam }) => fetchProductsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
  });

  return {
    ...query,
    products: query.data?.pages.flatMap(page => page.items) ?? [],
    loading: query.isLoading,
  };
};
