'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Image src="/logo.svg" alt="JAR" width={80} height={40} className="brightness-0 invert" />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">{t('tagline')}</p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            {(['nav_platform', 'nav_solutions', 'nav_about'] as const).map((key) => (
              <a key={key} href="#" className="block text-sm text-white/70 hover:text-accent transition-colors">
                {t(key)}
              </a>
            ))}
          </div>

          {/* Legal + contact */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white/80">{t('contact_label')}</p>
            <a
              href="mailto:info@jarsaudi.com"
              className="block text-sm text-accent hover:text-accent-light transition-colors"
            >
              info@jarsaudi.com
            </a>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">{t('nav_privacy')}</a>
              <a href="#" className="text-xs text-white/50 hover:text-white/80 transition-colors">{t('nav_terms')}</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/40">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
