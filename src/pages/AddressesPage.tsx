import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { useI18n } from '@/i18n/I18nProvider';
import { useAddresses, useAddAddress, useRemoveAddress } from '@/hooks/useAddresses';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const schema = z.object({
  name: z.string().min(2),
  details: z.string().min(5),
  phone: z.string().min(10),
  city: z.string().min(2),
});

export default function AddressesPage() {
  const { t } = useI18n();
  const { data: addresses, isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const removeAddress = useRemoveAddress();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    addAddress.mutate(data, {
      onSuccess: () => { reset(); setOpen(false); },
    });
  };

  if (isLoading) {
    return (
      <div className="container-main section-spacing">
        <h1 className="heading-section mb-8">{t.addresses.title}</h1>
        <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="container-main section-spacing">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="heading-section">{t.addresses.title}</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="me-1 h-4 w-4" /> {t.addresses.add}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t.addresses.add}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div>
                <Label>{t.addresses.name}</Label>
                <Input {...register('name')} className="mt-1 bg-secondary border-0" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{String(errors.name.message)}</p>}
              </div>
              <div>
                <Label>{t.addresses.details}</Label>
                <Input {...register('details')} className="mt-1 bg-secondary border-0" />
              </div>
              <div>
                <Label>{t.addresses.city}</Label>
                <Input {...register('city')} className="mt-1 bg-secondary border-0" />
              </div>
              <div>
                <Label>{t.addresses.phone}</Label>
                <Input {...register('phone')} className="mt-1 bg-secondary border-0" />
              </div>
              <Button type="submit" className="w-full" disabled={addAddress.isPending}>
                {addAddress.isPending ? t.common.loading : t.common.save}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!addresses?.length ? (
        <EmptyState
          icon={<MapPin className="h-8 w-8 text-muted-foreground" />}
          title={t.addresses.empty}
          description={t.addresses.emptyDesc}
        />
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="flex items-start justify-between rounded-xl bg-card card-elevated p-4">
              <div>
                <h3 className="font-medium">{addr.name}</h3>
                <p className="text-sm text-muted-foreground">{addr.details}</p>
                <p className="text-sm text-muted-foreground">{addr.city} · {addr.phone}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeAddress.mutate(addr._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
