import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Package, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuthStore } from '@/stores/authStore';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { data: cartData } = useCart();
  const { data: wishlistData } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success(t.auth.logoutSuccess);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartCount = cartData?.numOfCartItems || 0;
  const wishlistCount = wishlistData?.count || 0;

  const navLinks = [
    { to: '/', label: t.navbar.home },
    { to: '/products', label: t.navbar.products },
    { to: '/categories', label: t.navbar.categories },
    { to: '/brands', label: t.navbar.brands },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-background/80 shadow-sm backdrop-blur-lg border-b border-border'
            : 'bg-background'
        }`}
      >
        <div className="container-main">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
              FreshCart
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
              >
                <Globe className="h-4 w-4" />
              </Button>

              {isAuthenticated ? (
                <>
                  <Link to="/wishlist">
                    <Button variant="ghost" size="icon" className="relative">
                      <Heart className="h-4 w-4" />
                      {wishlistCount > 0 && (
                        <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground animate-badge-pop">
                          {wishlistCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="relative">
                      <ShoppingCart className="h-4 w-4" />
                      {cartCount > 0 && (
                        <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground animate-badge-pop">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  <Link to="/account">
                    <Button variant="ghost" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">{t.navbar.login}</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">{t.navbar.register}</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-4 w-4" />
              </Button>
              {isAuthenticated && (
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartCount > 0 && (
                      <span className="absolute -end-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              <form onSubmit={handleSearch} className="container-main py-3">
                <Input
                  placeholder={t.navbar.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-secondary border-0"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="absolute end-0 top-0 h-full w-72 bg-background shadow-xl border-s border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-6 pt-20">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="py-3 text-base font-medium text-foreground border-b border-border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link to="/wishlist" className="py-3 text-base font-medium text-foreground border-b border-border flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="h-4 w-4" /> {t.navbar.wishlist}
                    </Link>
                    <Link to="/orders" className="py-3 text-base font-medium text-foreground border-b border-border flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <Package className="h-4 w-4" /> {t.navbar.orders}
                    </Link>
                    <Link to="/addresses" className="py-3 text-base font-medium text-foreground border-b border-border flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <MapPin className="h-4 w-4" /> {t.account.addresses}
                    </Link>
                    <Link to="/account" className="py-3 text-base font-medium text-foreground border-b border-border flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4" /> {t.navbar.account}
                    </Link>
                    <button className="py-3 text-base font-medium text-destructive flex items-center gap-2 text-start" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" /> {t.navbar.logout}
                    </button>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">{t.navbar.login}</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">{t.navbar.register}</Button>
                    </Link>
                  </div>
                )}

                <button
                  className="mt-4 flex items-center gap-2 py-3 text-sm text-muted-foreground"
                  onClick={() => {
                    setLocale(locale === 'en' ? 'ar' : 'en');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Globe className="h-4 w-4" />
                  {locale === 'en' ? 'العربية' : 'English'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
