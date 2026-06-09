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

function FloatingDashboard() {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: [0.4, 0, 0.6, 1] as const }}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-400/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <div className="w-3 h-3 rounded-full bg-green-400/60" />
          <div className="flex-1 mx-3 h-5 bg-white/10 rounded-full" />
        </div>
        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[['1,240', 'وحدة'], ['91%', 'إشغال'], ['2.1M', 'SAR'], ['4.7★', 'رضا']].map(([val, lbl], i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-accent font-bold text-lg">{val}</div>
                <div className="text-white/60 text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[80, 55, 90].map((pct, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-20 text-xs text-white/60 truncate">
                  {['النخيل', 'واحة', 'برج'][i]}
                </div>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                    className="h-2 rounded-full bg-accent"
                  />
                </div>
                <div className="text-xs text-white/60 w-8">{pct}%</div>
              </div>
            ))}
          </div>
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
              className="text-white/70 text-lg leading-relaxed"
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

          {/* Floating dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <FloatingDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
