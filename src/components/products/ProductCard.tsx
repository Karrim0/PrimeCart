import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RatingStars from '@/components/shared/RatingStars';
import { useI18n } from '@/i18n/I18nProvider';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuthStore } from '@/stores/authStore';
import type { Product } from '@/types/api';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthStore();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlistData } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const isInWishlist = wishlistData?.data?.some((p) => p._id === product._id) || false;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (isInWishlist) {
      removeFromWishlist.mutate(product._id);
    } else {
      addToWishlist.mutate(product._id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    addToCart.mutate(product._id);
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-card card-elevated"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={imgError ? '/placeholder.svg' : product.imageCover}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          {product.priceAfterDiscount && (
            <span className="absolute start-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
              SALE
            </span>
          )}
          {isAuthenticated && (
            <button
              onClick={handleWishlistToggle}
              className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <Heart
                className={`h-4 w-4 ${isInWishlist ? 'fill-accent text-accent' : 'text-foreground'}`}
              />
            </button>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground">{product.category?.name}</p>
          <h3 className="mt-1 line-clamp-1 text-sm font-medium text-card-foreground">
            {product.title}
          </h3>
          <RatingStars rating={product.ratingsAverage} count={product.ratingsQuantity} size={12} />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="price-text text-card-foreground" dir="ltr">
                {t.common.egp} {(product.priceAfterDiscount || product.price).toLocaleString()}
              </span>
              {product.priceAfterDiscount && (
                <span className="text-xs text-muted-foreground line-through" dir="ltr">
                  {t.common.egp} {product.price.toLocaleString()}
                </span>
              )}
            </div>
            {isAuthenticated && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
