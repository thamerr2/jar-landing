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
    { key: 'platform' as const, href: '#solutions' },
    { key: 'solutions' as const, href: '#solutions' },
    { key: 'about' as const, href: '#about' },
    { key: 'contact' as const, href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href={`/${locale}`}>
          <Image
            src="/logo.svg"
            alt="JAR"
            width={72}
            height={36}
            className={scrolled ? '' : 'brightness-0 invert'}
          />
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
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

        {/* Actions */}
        <div className="flex items-center gap-3">
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
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-light transition-colors"
          >
            {t('cta')}
          </a>
        </div>
      </div>
    </header>
  );
}
