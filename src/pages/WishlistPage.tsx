import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { useI18n } from '@/i18n/I18nProvider';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';

export default function WishlistPage() {
  const { t } = useI18n();
  const { data: wishlistData, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  if (isLoading) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.wishlist.title}</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const items = wishlistData?.data || [];

  if (!items.length) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.wishlist.title}</h1>
        <EmptyState
          icon={<Heart className="h-8 w-8 text-muted-foreground" />}
          title={t.wishlist.empty}
          description={t.wishlist.emptyDesc}
          action={<Link to="/products"><Button>{t.cart.continueShopping}</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-main section-spacing">
      <h1 className="heading-section mb-8">{t.wishlist.title}</h1>
      <div className="space-y-4">
        {items.map((product) => (
          <motion.div key={product._id} layout className="flex gap-4 rounded-xl bg-card card-elevated p-4">
            <Link to={`/products/${product._id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              <img src={product.imageCover} alt={product.title} className="h-full w-full object-cover" />
            </Link>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link to={`/products/${product._id}`} className="font-medium text-card-foreground hover:underline line-clamp-1">{product.title}</Link>
                <p className="text-sm text-muted-foreground">{product.category?.name}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="price-text" dir="ltr">{t.common.egp} {product.price.toLocaleString()}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addToCart.mutate(product._id)} disabled={addToCart.isPending}>
                    <ShoppingCart className="me-1 h-3 w-3" /> {t.wishlist.moveToCart}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeFromWishlist.mutate(product._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
