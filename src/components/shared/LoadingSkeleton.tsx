import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card card-elevated">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card card-elevated">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4">
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
    </div>
  );
}
