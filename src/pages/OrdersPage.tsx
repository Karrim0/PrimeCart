import { Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { useI18n } from '@/i18n/I18nProvider';
import { useOrders } from '@/hooks/useOrders';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { t } = useI18n();
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.orders.title}</h1>
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.orders.title}</h1>
        <EmptyState
          icon={<Package className="h-8 w-8 text-muted-foreground" />}
          title={t.orders.empty}
          description={t.orders.emptyDesc}
          action={<Link to="/products"><Button>{t.cart.continueShopping}</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-main section-spacing">
      <h1 className="heading-section mb-8">{t.orders.title}</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl bg-card card-elevated p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">{t.orders.orderNumber} #{order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.cartItems?.length} {t.orders.items}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`rounded-md px-2 py-1 text-xs font-medium ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {order.isPaid ? t.orders.paid : t.orders.unpaid}
                </span>
                <span className={`rounded-md px-2 py-1 text-xs font-medium ${order.isDelivered ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-secondary-foreground'}`}>
                  {order.isDelivered ? t.orders.delivered : t.orders.pending}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {order.cartItems?.slice(0, 4).map((item, i) => (
                <div key={i} className="h-16 w-16 overflow-hidden rounded-lg bg-muted">
                  <img src={item.product?.imageCover} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {order.cartItems?.length > 4 && (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                  +{order.cartItems.length - 4}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{order.paymentMethodType}</span>
              <span className="price-text text-lg" dir="ltr">{t.common.egp} {order.totalOrderPrice?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
