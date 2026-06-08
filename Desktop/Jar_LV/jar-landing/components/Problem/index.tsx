'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const icons = ['🔀', '👁️', '🔧', '🧠'];
const cardKeys = ['card1', 'card2', 'card3', 'card4'] as const;

export default function Problem() {
  const t = useTranslations('problem');

  return (
    <section id="problem" className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-2xl md:text-3xl font-bold text-primary mb-16 leading-relaxed"
        >
          {t('tagline')}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-primary/5 hover:shadow-md hover:border-accent/20 transition-shadow"
            >
              <div className="text-3xl mb-4">{icons[i]}</div>
              <h3 className="font-bold text-primary mb-2">{t(`${key}_title`)}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{t(`${key}_desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
