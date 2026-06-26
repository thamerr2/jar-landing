'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import BrowserFrame from './BrowserFrame';
import MobileFrame from './MobileFrame';
import DeveloperDashboard from './DeveloperDashboard';
import ResidentApp from './ResidentApp';
import ServiceManagement from './ServiceManagement';

type TabId = 'developer' | 'resident' | 'services';

const tabs: { id: TabId; key: 'tab1' | 'tab2' | 'tab3'; device: 'browser' | 'mobile' }[] = [
  { id: 'developer', key: 'tab1', device: 'browser' },
  { id: 'resident',  key: 'tab2', device: 'mobile' },
  { id: 'services',  key: 'tab3', device: 'mobile' },
];

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.2, 0, 0, 1] as const } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
};

export default function Demo() {
  const t = useTranslations('demo');
  const [active, setActive] = useState<TabId>('developer');

  return (
    <section id="demo" className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('title')}</h2>
          <p className="text-text-muted">{t('subtitle')}</p>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {tabs.map(({ id, key }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              aria-pressed={active === id}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                active === id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-primary border border-primary/20 hover:border-accent/40'
              }`}
            >
              {t(key)}
            </button>
          ))}
        </div>

        {/* Mockup */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={active === 'developer' ? 'w-full max-w-2xl' : ''}
            >
              {active === 'developer' && (
                <BrowserFrame title="jar.app/dashboard">
                  <DeveloperDashboard />
                </BrowserFrame>
              )}
              {active === 'resident' && (
                <MobileFrame>
                  <ResidentApp />
                </MobileFrame>
              )}
              {active === 'services' && (
                <MobileFrame>
                  <ServiceManagement />
                </MobileFrame>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
