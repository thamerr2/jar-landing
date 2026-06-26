'use client';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/townhouses.jpg)', animation: 'kenBurns 22s ease-in-out infinite alternate' }}
      />

      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Gradient: darkens the side where text sits */}
      <div
        className={`absolute inset-0 ${
          isRTL
            ? 'bg-gradient-to-l from-black/70 via-black/30 to-transparent'
            : 'bg-gradient-to-r from-black/70 via-black/30 to-transparent'
        }`}
      />

      {/* Content — physically on right for AR, left for EN */}
      <div
        className={`absolute inset-y-0 w-1/2 z-10 flex items-center ${
          isRTL ? 'right-0' : 'left-0'
        }`}
      >
        <div
          className="w-full px-12 py-32"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white leading-tight mb-4 whitespace-pre-line"
          >
            {t('headline')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/75 text-base md:text-lg leading-relaxed mb-7"
          >
            {t('subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <a
              href="#contact"
              className="inline-block px-7 py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-light transition-colors shadow-lg shadow-accent/30 text-sm"
            >
              {t('cta_secondary')}
            </a>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="min-h-screen" />

    </section>
  );
}
