'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Marketing() {
  const t = useTranslations('marketing');

  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-relaxed max-w-4xl"
        >
          {t('quote1')}
        </motion.p>
      </div>
    </section>
  );
}
