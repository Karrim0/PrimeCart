import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { useI18n } from '@/i18n/I18nProvider';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart, useApplyCoupon } from '@/hooks/useCart';
import QuantitySelector from '@/components/shared/QuantitySelector';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function CartPage() {
  const { t } = useI18n();
  const { data: cartData, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const applyCoupon = useApplyCoupon();
  const [coupon, setCoupon] = useState('');

  if (isLoading) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.cart.title}</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const cart = cartData?.data;
  const items = cart?.products || [];

  if (!items.length) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.cart.title}</h1>
        <EmptyState
          icon={<ShoppingCart className="h-8 w-8 text-muted-foreground" />}
          title={t.cart.empty}
          description={t.cart.emptyDesc}
          action={
            <Link to="/products">
              <Button>{t.cart.continueShopping}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-main section-spacing">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="heading-section">{t.cart.title}</h1>
        <Button variant="ghost" size="sm" onClick={() => clearCart.mutate()} disabled={clearCart.isPending} className="text-destructive">
          <Trash2 className="me-1 h-4 w-4" /> {t.cart.clearCart}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item._id}
              layout
              className="flex gap-4 rounded-xl bg-card card-elevated p-4"
            >
              <Link to={`/products/${item.product?._id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={item.product?.imageCover} alt={item.product?.title} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link to={`/products/${item.product?._id}`} className="font-medium text-card-foreground hover:underline line-clamp-1">
                    {item.product?.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.product?.category?.name}</p>
                </div>
                <div className="flex items-center justify-between">
                  <QuantitySelector
                    value={item.count}
                    onChange={(count) => updateItem.mutate({ productId: item.product?._id, count })}
                    disabled={updateItem.isPending}
                  />
                  <div className="flex items-center gap-3">
                    <span className="price-text" dir="ltr">{t.common.egp} {(item.price * item.count).toLocaleString()}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem.mutate(item.product?._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-card card-elevated p-6">
            <h3 className="mb-4 font-semibold">{t.cart.subtotal}</h3>
            <Separator className="mb-4" />

            <div className="mb-4 flex items-center gap-2">
              <Input
                placeholder={t.cart.couponPlaceholder}
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="bg-secondary border-0"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => coupon && applyCoupon.mutate(coupon)}
                disabled={applyCoupon.isPending || !coupon}
              >
                {t.cart.applyCoupon}
              </Button>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>{t.cart.total}</span>
              <span className="price-text" dir="ltr">{t.common.egp} {cart?.totalCartPrice?.toLocaleString()}</span>
            </div>

            <Link to="/checkout" className="mt-6 block">
              <Button className="w-full h-12" size="lg">{t.cart.checkout}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
