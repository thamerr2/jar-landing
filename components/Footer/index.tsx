'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Image src="/logo.svg" alt="JAR" width={80} height={40} className="brightness-0 invert" />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">{t('tagline')}</p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white/80 mb-4">{t('nav_platform')}</p>
            {(
              [
                { key: 'nav_solutions', href: '#solutions' },
                { key: 'nav_about', href: '#about' },
                { key: 'nav_privacy', href: '#' },
                { key: 'nav_terms', href: '#' },
                { key: 'contact_label', href: '#contact' },
              ] as const
            ).map(({ key, href }) => (
              <a key={key} href={href} className="block text-sm text-white/60 hover:text-accent transition-colors">
                {t(key)}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white/80 mb-4">{t('contact_label')}</p>
            <a
              href={`mailto:${t('email')}`}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-accent transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              {t('email')}
            </a>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/40">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
