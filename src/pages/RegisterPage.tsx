import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import { useRegister } from '@/hooks/useAuth';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  rePassword: z.string().min(6),
  phone: z.string().min(10),
}).refine((d) => d.password === d.rePassword, {
  message: 'Passwords must match',
  path: ['rePassword'],
});

export default function RegisterPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const registerMut = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    registerMut.mutate(data, { onSuccess: () => navigate('/') });
  };

  return (
    <div className="container-main flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="heading-section mb-8 text-center">{t.auth.register}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>{t.auth.name}</Label>
            <Input {...register('name')} className="mt-1 bg-secondary border-0" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{String(errors.name.message)}</p>}
          </div>
          <div>
            <Label>{t.auth.email}</Label>
            <Input {...register('email')} type="email" className="mt-1 bg-secondary border-0" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{String(errors.email.message)}</p>}
          </div>
          <div>
            <Label>{t.auth.phone}</Label>
            <Input {...register('phone')} className="mt-1 bg-secondary border-0" />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{String(errors.phone.message)}</p>}
          </div>
          <div>
            <Label>{t.auth.password}</Label>
            <Input {...register('password')} type="password" className="mt-1 bg-secondary border-0" />
            {errors.password && <p className="mt-1 text-xs text-destructive">{String(errors.password.message)}</p>}
          </div>
          <div>
            <Label>{t.auth.rePassword}</Label>
            <Input {...register('rePassword')} type="password" className="mt-1 bg-secondary border-0" />
            {errors.rePassword && <p className="mt-1 text-xs text-destructive">{String(errors.rePassword.message)}</p>}
          </div>
          <Button type="submit" className="w-full h-11" disabled={registerMut.isPending}>
            {registerMut.isPending ? t.common.loading : t.auth.register}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.hasAccount}{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">{t.auth.login}</Link>
        </p>
      </div>
    </div>
  );
}
