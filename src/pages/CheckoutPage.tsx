import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/i18n/I18nProvider';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { useCashOrder, useCheckoutSession } from '@/hooks/useOrders';
import { useQueryClient } from '@tanstack/react-query';

const addressSchema = z.object({
  details: z.string().min(5),
  phone: z.string().min(10),
  city: z.string().min(2),
});

export default function CheckoutPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cartData } = useCart();
  const { data: addresses } = useAddresses();
  const cashOrder = useCashOrder();
  const checkoutSession = useCheckoutSession();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const cart = cartData?.data;
  const cartId = cart?._id;

  const onSubmit = (data: any) => {
    if (!cartId) return;

    const shippingAddress = selectedAddress
      ? (() => {
          const addr = addresses?.find((a) => a._id === selectedAddress);
          return addr ? { details: addr.details, phone: addr.phone, city: addr.city } : data;
        })()
      : data;

    if (paymentMethod === 'cash') {
      cashOrder.mutate({ cartId, shippingAddress }, {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ['cart'] });
          navigate('/orders');
        },
      });
    } else {
      checkoutSession.mutate({ cartId, shippingAddress }, {
        onSuccess: (res: any) => {
          if (res.session?.url) window.location.href = res.session.url;
        },
      });
    }
  };

  return (
    <div className="container-main section-spacing">
      <h1 className="heading-section mb-8">{t.checkout.title}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Saved addresses */}
            {addresses && addresses.length > 0 && (
              <div>
                <h3 className="mb-4 font-semibold">{t.checkout.selectAddress}</h3>
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                        selectedAddress === addr._id ? 'border-foreground bg-secondary' : 'border-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddress === addr._id}
                        onChange={() => setSelectedAddress(addr._id)}
                        className="accent-foreground"
                      />
                      <div>
                        <p className="font-medium">{addr.name}</p>
                        <p className="text-sm text-muted-foreground">{addr.details}, {addr.city} · {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Separator className="my-6" />
                <p className="text-sm text-muted-foreground mb-4">{t.checkout.orEnterNew}</p>
              </div>
            )}

            {/* New address */}
            {!selectedAddress && (
              <div className="space-y-4">
                <h3 className="font-semibold">{t.checkout.shippingAddress}</h3>
                <div>
                  <Label>{t.addresses.details}</Label>
                  <Input {...register('details')} className="mt-1 bg-secondary border-0" />
                  {errors.details && <p className="mt-1 text-xs text-destructive">{String(errors.details.message)}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.addresses.city}</Label>
                    <Input {...register('city')} className="mt-1 bg-secondary border-0" />
                  </div>
                  <div>
                    <Label>{t.addresses.phone}</Label>
                    <Input {...register('phone')} className="mt-1 bg-secondary border-0" />
                  </div>
                </div>
              </div>
            )}

            {/* Payment method */}
            <div>
              <h3 className="mb-4 font-semibold">{t.checkout.paymentMethod}</h3>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'online')} className="space-y-2">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === 'cash' ? 'border-foreground bg-secondary' : 'border-border'}`}>
                  <RadioGroupItem value="cash" />
                  <span className="font-medium">{t.checkout.cashOnDelivery}</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${paymentMethod === 'online' ? 'border-foreground bg-secondary' : 'border-border'}`}>
                  <RadioGroupItem value="online" />
                  <span className="font-medium">{t.checkout.onlinePayment}</span>
                </label>
              </RadioGroup>
            </div>

            <Button type="submit" size="lg" className="w-full h-12" disabled={cashOrder.isPending || checkoutSession.isPending}>
              {(cashOrder.isPending || checkoutSession.isPending) ? t.checkout.processing : t.checkout.placeOrder}
            </Button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <div className="sticky top-24 rounded-xl bg-card card-elevated p-6">
            <h3 className="mb-4 font-semibold">{t.cart.subtotal}</h3>
            <div className="space-y-2">
              {cart?.products?.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1">{item.product?.title} × {item.count}</span>
                  <span className="price-text" dir="ltr">{t.common.egp} {(item.price * item.count).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>{t.cart.total}</span>
              <span className="price-text" dir="ltr">{t.common.egp} {cart?.totalCartPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
