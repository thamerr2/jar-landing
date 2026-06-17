'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const slides = [
  { src: '/townhouses.jpg', ken: 'kenBurns'  },
  { src: '/building.jpg',   ken: 'kenBurns2' },
];

const pills = [
  { label: 'إدارة الوحدات' },
  { label: 'صيانة ذكية' },
  { label: 'دفع آمن' },
  { label: 'تقارير لحظية' },
];

export default function Hero() {
  const t = useTranslations('hero');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive(prev => (prev + 1) % slides.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${slide.src})`,
            animation: `${slide.ken} 22s ease-in-out infinite alternate`,
            opacity: i === active ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />
      ))}

      {/* Subtle base dimming so white text is always readable */}
      <div className="absolute inset-0 bg-black/25" />

      {/*
        RTL gradient: text sits on the RIGHT side (logical start).
        gradient-to-l = darker on right, transparent on left.
        This lets the building show clearly on the LEFT half.
      */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/25 to-transparent" />

      {/* Soft glow behind text area */}
      <div className="absolute inset-y-0 end-0 w-1/2 bg-gradient-to-l from-primary/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-32">
        <div className="max-w-2xl ms-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-white/90 text-sm font-medium">منصة إدارة المجتمعات السكنية</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold text-white leading-tight mb-5"
          >
            {t('headline')}
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-white/75 text-lg md:text-xl leading-relaxed max-w-lg mb-8"
          >
            {t('subheadline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full bg-accent text-white font-semibold hover:bg-accent-light transition-colors shadow-lg shadow-accent/30 text-base"
            >
              {t('cta_primary')}
            </a>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm text-base"
            >
              {t('cta_secondary')}
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.44 }}
            className="flex flex-wrap gap-2.5"
          >
            {pills.map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-white/90 text-sm"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-accent shrink-0">
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

    </section>
  );
}
