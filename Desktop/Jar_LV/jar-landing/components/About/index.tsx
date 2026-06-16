'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image — left in RTL */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about-image.jpg"
                alt="JAR residential community"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </div>
          </motion.div>

          {/* Text — right in RTL */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              {t('badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-snug">
              {t('title')}
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              {t('body')}
            </p>
            <ul className="space-y-4">
              {(['point1', 'point2', 'point3'] as const).map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center mt-0.5 shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-primary font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
