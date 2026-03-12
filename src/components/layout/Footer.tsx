import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-main py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
              FreshCart
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground leading-relaxed">
              {t.footer.description}
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">{t.navbar.products}</Link></li>
              <li><Link to="/categories" className="hover:text-foreground transition-colors">{t.navbar.categories}</Link></li>
              <li><Link to="/brands" className="hover:text-foreground transition-colors">{t.navbar.brands}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              {t.footer.customerService}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.contactUs}</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.faq}</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">{t.footer.shippingReturns}</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FreshCart. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
