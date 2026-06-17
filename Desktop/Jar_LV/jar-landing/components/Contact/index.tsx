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
          <p className="text-text-muted mb-6">{t('subtitle')}</p>

          {/* Contact links */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="mailto:info@jarsaudi.com"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l10 7 10-7" />
              </svg>
              info@jarsaudi.com
            </a>
            <a
              href="https://www.linkedin.com/company/jarsaudi/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM6.9 20.45H3.78V9H6.9v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
              LinkedIn
            </a>
          </div>
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
