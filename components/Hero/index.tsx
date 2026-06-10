'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as const } },
};

function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={wordVariant} className="inline-block me-2">
          {w}
        </motion.span>
      ))}
    </motion.h1>
  );
}

const feedEvents = [
  { time: '08:32', role: 'الساكن',      event: 'طلب صيانة — تكييف لا يبرد',              isJar: false },
  { time: '08:33', role: 'JAR',         event: 'تم تعيين المزود الأقرب تلقائياً ✓',       isJar: true  },
  { time: '08:51', role: 'المزود',      event: 'في الطريق — ETA 12 دقيقة',               isJar: false },
  { time: '09:04', role: 'JAR',         event: 'تم الإغلاق · رضا السكان ★★★★★',          isJar: true  },
];

function LiveFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.2, 0, 0, 1] as const }}
      className="w-full max-w-md mx-auto"
    >
      <div className="rounded-2xl border border-white/15 overflow-hidden shadow-2xl" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}>
        {/* Status bar */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          </span>
          <span className="text-white/50 text-xs tracking-wide">JAR — نشاط المنظومة</span>
        </div>
        {/* Events */}
        <div className="p-5 space-y-4">
          {feedEvents.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.75 + i * 0.28, ease: [0.2, 0, 0, 1] as const }}
              className="flex items-start gap-4"
            >
              <span className="text-white/30 text-xs tabular-nums shrink-0 mt-0.5 w-10">{e.time}</span>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-semibold ${e.isJar ? 'text-accent' : 'text-white/60'}`}>
                  {e.role}
                </span>
                <p className="text-white/80 text-sm leading-snug mt-0.5">{e.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="hero-gradient min-h-screen flex flex-col justify-center pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Text */}
          <div className="space-y-8">
            <AnimatedHeadline text={t('headline')} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/70 text-lg leading-relaxed max-w-lg"
            >
              {t('subheadline')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="px-8 py-3 rounded-full bg-accent text-white font-semibold hover:bg-accent-light transition-colors shadow-lg"
              >
                {t('cta_primary')}
              </a>
              <a
                href="#demo"
                className="px-8 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {t('cta_secondary')}
              </a>
            </motion.div>
          </div>

          {/* Live feed */}
          <LiveFeed />
        </div>
      </div>
    </section>
  );
}
