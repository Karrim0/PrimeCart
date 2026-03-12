import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/i18n/I18nProvider';
import { useBrands } from '@/hooks/useProducts';

export default function BrandsPage() {
  const { t } = useI18n();
  const { data: brands, isLoading } = useBrands();

  return (
    <div className="container-main section-spacing">
      <h1 className="heading-section mb-8">{t.brands.title}</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {brands?.map((brand) => (
            <Link key={brand._id} to={`/products?brand=${brand._id}`}>
              <motion.div
                className="group overflow-hidden rounded-xl bg-card card-elevated p-6 flex flex-col items-center justify-center aspect-square"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <img src={brand.image} alt={brand.name} className="max-h-20 max-w-full object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                <p className="mt-3 text-xs font-medium text-card-foreground text-center">{brand.name}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
