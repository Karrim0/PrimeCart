import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import { useLogin } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    login.mutate(data, { onSuccess: () => navigate('/') });
  };

  return (
    <div className="container-main flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <h1 className="heading-section mb-8 text-center">{t.auth.login}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>{t.auth.email}</Label>
            <Input {...register('email')} type="email" className="mt-1 bg-secondary border-0" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{String(errors.email.message)}</p>}
          </div>
          <div>
            <Label>{t.auth.password}</Label>
            <Input {...register('password')} type="password" className="mt-1 bg-secondary border-0" />
            {errors.password && <p className="mt-1 text-xs text-destructive">{String(errors.password.message)}</p>}
          </div>
          <Link to="/forgot-password" className="block text-end text-sm text-muted-foreground hover:text-foreground">
            {t.auth.forgotPassword}
          </Link>
          <Button type="submit" className="w-full h-11" disabled={login.isPending}>
            {login.isPending ? t.common.loading : t.auth.login}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t.auth.noAccount}{' '}
          <Link to="/register" className="font-medium text-foreground hover:underline">{t.auth.register}</Link>
        </p>
      </div>
    </div>
  );
}
