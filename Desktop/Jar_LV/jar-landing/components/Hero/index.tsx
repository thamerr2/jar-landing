'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const pills = [
  { label: 'إدارة الوحدات' },
  { label: 'صيانة ذكية' },
  { label: 'دفع آمن' },
  { label: 'تقارير لحظية' },
];

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* Background — single residential community image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/townhouses.jpg)', animation: 'kenBurns 22s ease-in-out infinite alternate' }}
      />

      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* RTL gradient: darker on the right where text sits */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />

      {/* Content — physically anchored to the right */}
      <div className="absolute inset-y-0 right-0 w-1/2 z-10 flex items-center">
        <div className="w-full px-12 py-32" style={{ direction: 'rtl' }}>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white leading-tight mb-4"
          >
            {t('headline')}
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/75 text-base md:text-lg leading-relaxed mb-7"
          >
            {t('subheadline')}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mb-8"
          >
            <a
              href="#contact"
              className="inline-block px-7 py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-light transition-colors shadow-lg shadow-accent/30 text-sm"
            >
              {t('cta_secondary')}
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {pills.map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-white/90 text-xs"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 text-accent shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {pill.label}
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* Spacer so section has correct height */}
      <div className="min-h-screen" />

    </section>
  );
}
