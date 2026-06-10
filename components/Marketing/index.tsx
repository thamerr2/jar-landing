'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Marketing() {
  const t = useTranslations('marketing');

  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-20"
        >
          {t('title')}
        </motion.h2>

        {/* Hero quote — full width, largest */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/15 pt-10 pb-12"
        >
          <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-4xl">
            {t('quote1')}
          </p>
        </motion.div>

        {/* Mid-tier quotes — 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-white/10 pt-10 pb-12">
          <motion.p
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-lg md:text-xl text-white/85 font-medium leading-relaxed"
          >
            {t('quote2')}
          </motion.p>
          <motion.p
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg md:text-xl text-white/85 font-medium leading-relaxed mt-8 md:mt-0"
          >
            {t('quote3')}
          </motion.p>
        </div>

        {/* Supporting quotes — 2 columns, quieter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-white/10 pt-10">
          <motion.p
            initial={{ y: 12 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-base text-white/55 leading-relaxed"
          >
            {t('quote4')}
          </motion.p>
          <motion.p
            initial={{ y: 12 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base text-white/55 leading-relaxed mt-6 md:mt-0"
          >
            {t('quote5')}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
