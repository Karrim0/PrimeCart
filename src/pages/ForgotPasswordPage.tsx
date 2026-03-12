import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import { useForgotPassword, useVerifyResetCode, useResetPassword } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const forgotPw = useForgotPassword();
  const verifyCode = useVerifyResetCode();
  const resetPw = useResetPassword();

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPw.mutate({ email }, { onSuccess: () => setStep('code') });
  };

  const [code, setCode] = useState('');
  const handleCode = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode.mutate({ resetCode: code }, { onSuccess: () => setStep('reset') });
  };

  const [newPassword, setNewPassword] = useState('');
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    resetPw.mutate({ email, newPassword }, { onSuccess: () => navigate('/login') });
  };

  return (
    <div className="container-main flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        {step === 'email' && (
          <>
            <h1 className="heading-section mb-2 text-center">{t.auth.forgotTitle}</h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">{t.auth.forgotDesc}</p>
            <form onSubmit={handleEmail} className="space-y-4">
              <div>
                <Label>{t.auth.email}</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 bg-secondary border-0" required />
              </div>
              <Button type="submit" className="w-full h-11" disabled={forgotPw.isPending}>
                {forgotPw.isPending ? t.common.loading : t.auth.sendCode}
              </Button>
            </form>
          </>
        )}

        {step === 'code' && (
          <>
            <h1 className="heading-section mb-2 text-center">{t.auth.verifyCode}</h1>
            <p className="mb-8 text-center text-sm text-muted-foreground">{t.auth.verifyDesc}</p>
            <form onSubmit={handleCode} className="space-y-4">
              <div>
                <Label>{t.auth.resetCode}</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 bg-secondary border-0" required />
              </div>
              <Button type="submit" className="w-full h-11" disabled={verifyCode.isPending}>
                {verifyCode.isPending ? t.common.loading : t.auth.verify}
              </Button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <h1 className="heading-section mb-8 text-center">{t.auth.resetPassword}</h1>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <Label>{t.auth.newPassword}</Label>
                <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="mt-1 bg-secondary border-0" required minLength={6} />
              </div>
              <Button type="submit" className="w-full h-11" disabled={resetPw.isPending}>
                {resetPw.isPending ? t.common.loading : t.auth.resetPassword}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
