const BRONZE  = "#BC7D37";
const BRONZE2 = "#D4A055";
const TEXT    = "#F8FAFC";
const MUTED   = "#B8A99A";

interface Stat { label: string; value: string; delta: string; up: boolean }

const STATS: Stat[] = [
  { label: "طلبات مفتوحة",    value: "١٢",          delta: "+٣ اليوم",      up: true  },
  { label: "مزودون نشطون",    value: "٥",           delta: "في الموقع",    up: true  },
  { label: "مدفوعات معلقة",   value: "٤٬٢٠٠ ر.س",   delta: "فاتورتان",    up: false },
];

const REQUESTS = [
  { id: "طلب-٠٤١", title: "إصلاح تكييف — وحدة 4ب",  status: "in_progress", score: 94 },
  { id: "طلب-٠٤٢", title: "سباكة — وحدة 7أ",          status: "assigned",    score: 88 },
  { id: "طلب-٠٤٣", title: "طلاء — اللوبي",             status: "submitted",   score: 72 },
];

const STATUS_COLOR: Record<string, string> = {
  in_progress: BRONZE,
  assigned:    BRONZE2,
  submitted:   "#D4A055",
  completed:   "#10B981",
};

export function MockDashboard({ reveal = 1 }: { reveal?: number }) {
  const r = Math.max(0, Math.min(1, reveal));

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background:     "rgba(42,47,64,0.9)",
        backdropFilter: "blur(24px)",
        borderColor:    `rgba(188,125,55,${0.15 + r * 0.25})`,
        boxShadow:      `0 0 ${40 + r * 80}px rgba(188,125,55,${0.05 + r * 0.15})`,
        opacity:         0.3 + r * 0.7,
        transform:      `scale(${0.92 + r * 0.08}) translateY(${(1 - r) * 30}px)`,
        width:          "100%",
        maxWidth:       520,
      }}
    >
      {/* Window chrome */}
      <div className="px-5 py-4 flex items-center gap-3 border-b"
        style={{ borderColor: "rgba(188,125,55,0.15)" }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: BRONZE }} />
        <span className="text-sm font-semibold" style={{ color: TEXT }}>جار — لوحة الإدارة</span>
        <div className="ltr:ml-auto rtl:mr-auto flex gap-1.5">
          {["#FF5F57","#FEBC2E","#28C840"].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {STATS.map(s => (
          <div key={s.label} className="rounded-xl p-3"
            style={{ background: "rgba(188,125,55,0.08)", border: "1px solid rgba(188,125,55,0.15)" }}>
            <div className="text-lg font-bold" style={{ color: BRONZE }}>{s.value}</div>
            <div className="text-xs mt-0.5 truncate" style={{ color: TEXT }}>{s.label}</div>
            <div className="text-xs mt-1" style={{ color: s.up ? BRONZE : BRONZE2 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Request list */}
      <div className="px-4 pb-4 space-y-2">
        {REQUESTS.map(req => (
          <div key={req.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(188,125,55,0.1)" }}>
            <div className="w-1.5 h-8 rounded-full flex-shrink-0"
              style={{ background: STATUS_COLOR[req.status] }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: TEXT }}>{req.title}</div>
              <div className="text-xs mt-0.5" style={{ color: MUTED }}>{req.id}</div>
            </div>
            <div className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(188,125,55,0.15)", color: BRONZE }}>
              {req.score}%
            </div>
          </div>
        ))}
      </div>

      {/* AI badge */}
      <div className="mx-4 mb-4 rounded-xl p-3 flex items-center gap-2"
        style={{ background: "rgba(188,125,55,0.12)", border: "1px solid rgba(188,125,55,0.25)" }}>
        <div className="text-lg">✦</div>
        <div>
          <div className="text-xs font-semibold" style={{ color: BRONZE2 }}>الذكاء الاصطناعي نشط</div>
          <div className="text-xs" style={{ color: MUTED }}>٣ مزودين تم تقييمهم لطلب-٠٤١</div>
        </div>
      </div>
    </div>
  );
}
