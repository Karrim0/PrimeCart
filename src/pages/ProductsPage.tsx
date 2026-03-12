import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ProductGrid from '@/components/products/ProductGrid';
import PaginationControls from '@/components/shared/PaginationControls';
import { useI18n } from '@/i18n/I18nProvider';
import { useProducts, useCategories, useBrands } from '@/hooks/useProducts';

export default function ProductsPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const currentPage = Number(searchParams.get('page')) || 1;
  const categoryFilter = searchParams.get('category') || '';
  const brandFilter = searchParams.get('brand') || '';
  const sortFilter = searchParams.get('sort') || '';
  const priceMin = Number(searchParams.get('priceMin')) || 0;
  const priceMax = Number(searchParams.get('priceMax')) || 50000;

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const params: any = { limit: 12, page: currentPage };
  if (keyword) params.keyword = keyword;
  if (categoryFilter) params['category[in]'] = categoryFilter;
  if (brandFilter) params.brand = brandFilter;
  if (sortFilter) params.sort = sortFilter;
  if (priceMin > 0) params['price[gte]'] = priceMin;
  if (priceMax < 50000) params['price[lte]'] = priceMax;

  const { data, isLoading } = useProducts(params);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setKeyword('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('keyword', keyword);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">{t.products.category}</h4>
        <Select value={categoryFilter} onValueChange={(v) => updateParam('category', v === 'all' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder={t.products.category} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.categories.viewAll}</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">{t.products.brand}</h4>
        <Select value={brandFilter} onValueChange={(v) => updateParam('brand', v === 'all' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder={t.products.brand} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.categories.viewAll}</SelectItem>
            {brands?.map((b) => (
              <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">{t.products.sortBy}</h4>
        <Select value={sortFilter} onValueChange={(v) => updateParam('sort', v === 'none' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder={t.products.sortBy} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">—</SelectItem>
            <SelectItem value="price">{t.products.priceLowHigh}</SelectItem>
            <SelectItem value="-price">{t.products.priceHighLow}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-2 text-sm font-semibold">{t.products.priceRange}</h4>
        <Slider
          value={[priceMin, priceMax]}
          min={0}
          max={50000}
          step={100}
          onValueChange={([min, max]) => {
            const newParams = new URLSearchParams(searchParams);
            if (min > 0) newParams.set('priceMin', String(min)); else newParams.delete('priceMin');
            if (max < 50000) newParams.set('priceMax', String(max)); else newParams.delete('priceMax');
            newParams.delete('page');
            setSearchParams(newParams);
          }}
          className="mt-4"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span dir="ltr">{t.common.egp} {priceMin.toLocaleString()}</span>
          <span dir="ltr">{t.common.egp} {priceMax.toLocaleString()}</span>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
        <X className="me-2 h-3 w-3" />
        {t.products.clearFilters}
      </Button>
    </div>
  );

  return (
    <div className="container-main section-spacing">
      <div className="mb-8">
        <h1 className="heading-section">{t.products.all}</h1>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <Input
          placeholder={t.navbar.search}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-md bg-secondary border-0"
        />
      </form>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-24">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">{t.products.filters}</h3>
            <FilterContent />
          </div>
        </aside>

        {/* Mobile filter button */}
        <div className="md:hidden fixed bottom-4 end-4 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg h-12 w-12">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-xl">
              <SheetHeader>
                <SheetTitle>{t.products.filters}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid products={data?.data} isLoading={isLoading} />
          {data?.metadata && (
            <PaginationControls
              currentPage={data.metadata.currentPage}
              totalPages={data.metadata.numberOfPages}
              onPageChange={(page) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', String(page));
                setSearchParams(newParams);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
