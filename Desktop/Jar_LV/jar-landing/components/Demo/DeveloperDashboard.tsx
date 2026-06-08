'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function DeveloperDashboard() {
  const t = useTranslations('demo');

  const kpis = [
    { value: t('dev_kpi1_value'), label: t('dev_kpi1_label') },
    { value: t('dev_kpi2_value'), label: t('dev_kpi2_label') },
    { value: t('dev_kpi3_value'), label: t('dev_kpi3_label') },
    { value: t('dev_kpi4_value'), label: t('dev_kpi4_label') },
  ];

  const rows = [
    { name: t('dev_row1_name'), pct: 80, status: t('dev_row1_status'), active: true },
    { name: t('dev_row2_name'), pct: 45, status: t('dev_row2_status'), active: false },
    { name: t('dev_row3_name'), pct: 92, status: t('dev_row3_status'), active: true },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-5 space-y-5 bg-white">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">Dashboard</p>
          <p className="font-bold text-primary">{t('dev_project')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs text-accent font-bold">م</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-bg-secondary flex items-center justify-center">
            <svg className="w-3 h-3 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-bg-secondary rounded-xl p-3">
            <div className="text-accent font-bold text-lg leading-none">{kpi.value}</div>
            <div className="text-xs text-text-muted mt-1">{kpi.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Projects table */}
      <motion.div variants={item} className="space-y-1">
        <div className="grid grid-cols-3 text-xs text-text-muted font-medium px-1 pb-1 border-b border-gray-100">
          <span>{t('dev_table_header_project')}</span>
          <span className="text-center">{t('dev_table_header_progress')}</span>
          <span className="text-end">{t('dev_table_header_status')}</span>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 items-center gap-2 px-1 py-2 rounded-lg hover:bg-bg-secondary transition-colors">
            <span className="text-xs text-primary font-medium truncate">{row.name}</span>
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className="h-1.5 rounded-full bg-accent"
                />
              </div>
              <span className="text-xs text-text-muted w-7 text-end">{row.pct}%</span>
            </div>
            <span className={`text-end text-xs px-2 py-0.5 rounded-full justify-self-end ${
              row.active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {row.status}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Mini chart */}
      <motion.div variants={item} className="bg-bg-secondary rounded-xl p-3">
        <p className="text-xs text-text-muted mb-2">التحصيلات — 6 أشهر</p>
        <svg viewBox="0 0 200 60" className="w-full h-12" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8924A" />
              <stop offset="100%" stopColor="#B8924A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points="0,50 33,38 66,42 100,25 133,20 166,15 200,10 200,60 0,60"
            fill="url(#chartGrad)"
            opacity="0.3"
          />
          <polyline
            points="0,50 33,38 66,42 100,25 133,20 166,15 200,10"
            fill="none"
            stroke="#B8924A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
