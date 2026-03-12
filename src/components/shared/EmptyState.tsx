import { useI18n } from '@/i18n/I18nProvider';
import { ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {icon || <ShoppingBag className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
