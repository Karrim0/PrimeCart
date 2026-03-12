import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@/components/shared/LoadingSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import { useI18n } from '@/i18n/I18nProvider';
import { Package } from 'lucide-react';
import type { Product } from '@/types/api';

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const { t } = useI18n();

  if (isLoading) return <ProductGridSkeleton />;

  if (!products?.length) {
    return (
      <EmptyState
        icon={<Package className="h-8 w-8 text-muted-foreground" />}
        title={t.products.noProducts}
        description={t.products.tryDifferent}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
