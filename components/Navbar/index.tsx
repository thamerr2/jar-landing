'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === 'ar' ? 'en' : 'ar' });
  };

  const navLinks = [
    { key: 'home' as const, href: '#' },
    { key: 'about_label' as const, href: '#about' },
    { key: 'services' as const, href: '#solutions' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="w-full px-12 h-16 flex items-center relative">
        {/* Logo — far right in RTL, far left in LTR */}
        <a href={`/${locale}`} className="shrink-0">
          <Image
            src="/logo.svg"
            alt="JAR"
            width={72}
            height={36}
            className="brightness-0 invert"
          />
        </a>

        {/* Nav links — absolutely centered on the full page */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-primary hover:text-accent' : 'text-white/80 hover:text-white'
              }`}
            >
              {t(key)}
            </a>
          ))}
        </nav>

        {/* Actions — pushed to the opposite end */}
        <div className="shrink-0 flex items-center gap-3 ms-auto">
          <button
            onClick={switchLocale}
            className={`text-sm font-medium px-3 py-1 rounded-full border transition-colors ${
              scrolled
                ? 'border-primary/20 text-primary hover:border-accent hover:text-accent'
                : 'border-white/30 text-white hover:border-white'
            }`}
            aria-label="Switch language"
          >
            {locale === 'ar' ? 'EN' : 'AR'}
          </button>

          <a
            href="#contact"
            className={`hidden md:inline-flex items-center px-5 py-2 rounded-full border text-sm font-semibold transition-colors ${
              scrolled
                ? 'border-primary/20 text-primary hover:border-accent hover:text-accent'
                : 'border-white/40 text-white hover:bg-white/10'
            }`}
          >
            {t('login')}
          </a>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-light transition-colors"
          >
            {t('register')}
          </a>
        </div>
      </div>
    </header>
  );
}
