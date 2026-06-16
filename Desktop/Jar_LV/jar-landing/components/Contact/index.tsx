'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Contact() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('title')}</h2>
          <p className="text-text-muted">{t('subtitle')}</p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 px-8 rounded-2xl bg-bg-secondary"
          >
            <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-3">{t('success_title')}</h3>
            <p className="text-text-muted">{t('success_message')}</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('name')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('placeholder_name')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('email')}</label>
                <input
                  type="email"
                  required
                  placeholder={t('placeholder_email')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('phone')}</label>
                <input
                  type="tel"
                  placeholder={t('placeholder_phone')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">{t('company')}</label>
                <input
                  type="text"
                  placeholder={t('placeholder_company')}
                  className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">{t('message')}</label>
              <textarea
                rows={4}
                placeholder={t('placeholder_message')}
                className="w-full px-4 py-3 rounded-xl border border-primary/15 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-accent text-white font-semibold text-base hover:bg-accent-light transition-colors shadow-md shadow-accent/20"
            >
              {t('submit')}
            </button>
          </motion.form>
        )}

      </div>
    </section>
  );
}
