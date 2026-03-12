import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useI18n } from '@/i18n/I18nProvider';
import { useCategories } from '@/hooks/useProducts';

export default function CategoriesPage() {
  const { t } = useI18n();
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="container-main section-spacing">
      <h1 className="heading-section mb-8">{t.categories.title}</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4"><Skeleton className="h-4 w-2/3 mx-auto" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories?.map((cat) => (
            <Link key={cat._id} to={`/products?category=${cat._id}`}>
              <motion.div
                className="group overflow-hidden rounded-xl bg-card card-elevated"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-card-foreground">{cat.name}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
