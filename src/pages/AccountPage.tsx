import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Lock, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuthStore } from '@/stores/authStore';
import { useUpdateProfile, useChangePassword } from '@/hooks/useAuth';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  password: z.string().min(6),
  rePassword: z.string().min(6),
}).refine((d) => d.password === d.rePassword, { message: 'Passwords must match', path: ['rePassword'] });

export default function AccountPage() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: '' },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <div className="container-main section-spacing">
      <h1 className="heading-section mb-8">{t.account.title}</h1>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <nav className="space-y-1">
          <Link to="/account" className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium">
            <User className="h-4 w-4" /> {t.account.profile}
          </Link>
          <Link to="/addresses" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">
            <MapPin className="h-4 w-4" /> {t.account.addresses}
          </Link>
          <Link to="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">
            <Package className="h-4 w-4" /> {t.navbar.orders}
          </Link>
        </nav>

        <div>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">{t.account.updateProfile}</TabsTrigger>
              <TabsTrigger value="password">{t.account.changePassword}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <form onSubmit={profileForm.handleSubmit((data) => updateProfile.mutate(data))} className="max-w-md space-y-4">
                <div>
                  <Label>{t.auth.name}</Label>
                  <Input {...profileForm.register('name')} className="mt-1 bg-secondary border-0" />
                </div>
                <div>
                  <Label>{t.auth.email}</Label>
                  <Input {...profileForm.register('email')} type="email" className="mt-1 bg-secondary border-0" />
                </div>
                <div>
                  <Label>{t.auth.phone}</Label>
                  <Input {...profileForm.register('phone')} className="mt-1 bg-secondary border-0" />
                </div>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? t.common.loading : t.common.save}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password" className="mt-6">
              <form onSubmit={passwordForm.handleSubmit((data) => changePassword.mutate(data as any))} className="max-w-md space-y-4">
                <div>
                  <Label>{t.account.currentPassword}</Label>
                  <Input {...passwordForm.register('currentPassword')} type="password" className="mt-1 bg-secondary border-0" />
                </div>
                <div>
                  <Label>{t.auth.newPassword}</Label>
                  <Input {...passwordForm.register('password')} type="password" className="mt-1 bg-secondary border-0" />
                </div>
                <div>
                  <Label>{t.auth.rePassword}</Label>
                  <Input {...passwordForm.register('rePassword')} type="password" className="mt-1 bg-secondary border-0" />
                  {passwordForm.formState.errors.rePassword && (
                    <p className="mt-1 text-xs text-destructive">{String(passwordForm.formState.errors.rePassword.message)}</p>
                  )}
                </div>
                <Button type="submit" disabled={changePassword.isPending}>
                  {changePassword.isPending ? t.common.loading : t.common.save}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
