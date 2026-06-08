'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const actionIcons = ['🔧', '💳', '📄', '👥'];

export default function ResidentApp() {
  const t = useTranslations('demo');

  const actions = [
    t('res_action1'),
    t('res_action2'),
    t('res_action3'),
    t('res_action4'),
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-5 space-y-5 bg-white min-h-full">
      {/* Greeting */}
      <motion.div variants={item} className="bg-primary rounded-2xl p-5 text-white">
        <p className="text-sm opacity-70 mb-1">{t('res_greeting')}</p>
        <p className="font-bold">{t('res_unit')}</p>
      </motion.div>

      {/* Balance */}
      <motion.div variants={item} className="flex items-center justify-between bg-bg-secondary rounded-2xl p-4">
        <div>
          <p className="text-xs text-text-muted">{t('res_balance_label')}</p>
          <p className="text-xl font-bold text-primary mt-0.5">{t('res_balance_value')}</p>
        </div>
        <button className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-light transition-colors">
          {t('res_pay_btn')}
        </button>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item} className="grid grid-cols-4 gap-2">
        {actions.map((action, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-2xl bg-bg-secondary flex items-center justify-center text-xl">
              {actionIcons[i]}
            </div>
            <span className="text-xs text-text-muted text-center leading-tight">{action}</span>
          </div>
        ))}
      </motion.div>

      {/* Open request */}
      <motion.div variants={item} className="border border-green-200 bg-green-50 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-primary text-sm">{t('res_request_title')}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t('res_request_status')}
            </p>
          </div>
          <span className="text-lg">🔧</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
