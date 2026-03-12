import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { ProductGridSkeleton, CategoryCardSkeleton } from '@/components/shared/LoadingSkeleton';
import { useI18n } from '@/i18n/I18nProvider';
import { useProducts, useCategories, useBrands } from '@/hooks/useProducts';
import { useState } from 'react';

export default function HomePage() {
  const { t } = useI18n();
  const { data: featuredData, isLoading: featuredLoading } = useProducts({ limit: 8 });
  const { data: trendingData, isLoading: trendingLoading } = useProducts({ limit: 4, sort: '-sold' });
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="container-main py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="heading-display text-foreground">{t.hero.title}</h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="h-12 px-8 text-base">
                    {t.hero.shopNow}
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/categories">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    {t.hero.explore}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="heading-section">{t.categories.shopByCategory}</h2>
            <Link to="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t.common.seeAll} →
            </Link>
          </div>
          {catsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {categories?.slice(0, 6).map((cat) => (
                <Link key={cat._id} to={`/products?category=${cat._id}`}>
                  <motion.div
                    className="group overflow-hidden rounded-xl bg-card card-elevated"
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-medium text-card-foreground">{cat.name}</h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing bg-secondary/50">
        <div className="container-main">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="heading-section">{t.products.featured}</h2>
            <Link to="/products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t.common.seeAll} →
            </Link>
          </div>
          <ProductGrid products={featuredData?.data} isLoading={featuredLoading} />
        </div>
      </section>

      {/* Brands */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="heading-section">{t.brands.shopByBrand}</h2>
            <Link to="/brands" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t.common.seeAll} →
            </Link>
          </div>
          {brandsLoading ? (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => <CategoryCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {brands?.slice(0, 6).map((brand) => (
                <Link key={brand._id} to={`/products?brand=${brand._id}`}>
                  <motion.div
                    className="group overflow-hidden rounded-xl bg-card card-elevated p-4 flex items-center justify-center aspect-square"
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending */}
      <section className="section-spacing bg-secondary/50">
        <div className="container-main">
          <h2 className="heading-section mb-8">{t.products.trending}</h2>
          <ProductGrid products={trendingData?.data} isLoading={trendingLoading} />
        </div>
      </section>
    </div>
  );
}
