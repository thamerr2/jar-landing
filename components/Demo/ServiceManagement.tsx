'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const catIcons = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 2a1 1 0 00-1 1v10.26a4 4 0 105.96-.01V3a1 1 0 00-1-1H9z" />
    <path d="M12 17v.01" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
];

export default function ServiceManagement() {
  const t = useTranslations('demo');
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedCat, setSelectedCat] = useState(0);

  const cats = [t('svc_cat1'), t('svc_cat2'), t('svc_cat3')];
  const slots = [t('svc_slot1'), t('svc_slot2')];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-5 space-y-5 bg-white min-h-full">
      <motion.div variants={item}>
        <p className="text-xl font-bold text-primary">{t('svc_title')}</p>
        <p className="text-sm text-text-muted">{t('svc_subtitle')}</p>
      </motion.div>

      {/* Categories */}
      <motion.div variants={item} className="grid grid-cols-3 gap-2">
        {cats.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCat(i)}
            className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
              selectedCat === i
                ? 'bg-primary text-white shadow-md'
                : 'bg-bg-secondary text-primary hover:bg-bg-secondary/80'
            }`}
          >
            {catIcons[i]}
            <span className="text-xs font-medium">{cat}</span>
          </button>
        ))}
      </motion.div>

      {/* Problem description */}
      <motion.div variants={item} className="space-y-1.5">
        <label className="text-xs font-semibold text-primary">{t('svc_problem_label')}</label>
        <div className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-text-muted bg-bg-secondary/40">
          {t('svc_problem_placeholder')}
        </div>
      </motion.div>

      {/* Time slots */}
      <motion.div variants={item} className="space-y-2">
        <label className="text-xs font-semibold text-primary">{t('svc_time_label')}</label>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedSlot(i)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                selectedSlot === i
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-bg-secondary text-primary hover:bg-accent/10'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Confirm */}
      <motion.div variants={item}>
        <button className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-light transition-colors shadow-md">
          {t('svc_confirm')}
        </button>
      </motion.div>
    </motion.div>
  );
}
