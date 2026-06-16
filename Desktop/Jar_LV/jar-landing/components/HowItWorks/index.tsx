'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const stepKeys = ['s1', 's2', 's3', 's4'] as const;

export default function HowItWorks() {
  const t = useTranslations('how');

  return (
    <section id="how" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('title')}</h2>
          <p className="text-text-muted max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-8 start-[12.5%] end-[12.5%] h-px bg-primary/10" />

          {stepKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              {/* Step number circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                <span className="text-2xl font-bold text-white">{i + 1}</span>
              </div>

              <h3 className="font-bold text-primary text-base mb-2">{t(`${key}_title`)}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{t(`${key}_desc`)}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
