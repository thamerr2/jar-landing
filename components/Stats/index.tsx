'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Stats() {
  const t = useTranslations('stats');

  const items = [
    { value: t('s1_value'), label: t('s1_label') },
    { value: t('s2_value'), label: t('s2_label') },
    { value: t('s3_value'), label: t('s3_label') },
    { value: t('s4_value'), label: t('s4_label') },
  ];

  return (
    <section className="bg-white border-b border-primary/8 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/8 rounded-2xl overflow-hidden"
        >
          {items.map((item, i) => (
            <div key={i} className="bg-white px-6 py-7 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{item.value}</div>
              <div className="text-sm text-text-muted mt-1.5">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
