'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const quoteKeys = ['quote1', 'quote2', 'quote3', 'quote4', 'quote5'] as const;

export default function Marketing() {
  const t = useTranslations('marketing');

  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quoteKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-7 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-accent/40 transition-all"
            >
              <div className="w-8 h-1 bg-accent rounded mb-4" />
              <p className="text-white font-semibold text-lg leading-relaxed">
                {t(key)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
