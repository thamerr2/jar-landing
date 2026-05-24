const GREEN  = "#7FD4A0";
const TEAL   = "#0D9488";
const TEXT   = "#F8FAFC";
const MUTED  = "#94A3B8";

interface Stat { label: string; value: string; delta: string; up: boolean }

const STATS: Stat[] = [
  { label: "Open Requests",    value: "12",          delta: "+3 today",   up: true  },
  { label: "Active Providers", value: "5",           delta: "on site",    up: true  },
  { label: "Pending Payments", value: "SAR 4,200",   delta: "2 invoices", up: false },
];

const REQUESTS = [
  { id: "REQ-041", title: "AC Repair — Unit 4B",  status: "in_progress", score: 94 },
  { id: "REQ-042", title: "Plumbing — Unit 7A",   status: "assigned",    score: 88 },
  { id: "REQ-043", title: "Painting — Lobby",     status: "submitted",   score: 72 },
];

const STATUS_COLOR: Record<string, string> = {
  in_progress: GREEN,
  assigned:    TEAL,
  submitted:   "#F59E0B",
  completed:   "#10B981",
};

export function MockDashboard({ reveal = 1 }: { reveal?: number }) {
  const r = Math.max(0, Math.min(1, reveal));

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{
        background:     "rgba(13,31,26,0.85)",
        backdropFilter: "blur(24px)",
        borderColor:    `rgba(127,212,160,${0.15 + r * 0.25})`,
        boxShadow:      `0 0 ${40 + r * 80}px rgba(127,212,160,${0.05 + r * 0.15})`,
        opacity:         0.3 + r * 0.7,
        transform:      `scale(${0.92 + r * 0.08}) translateY(${(1 - r) * 30}px)`,
        width:          "100%",
        maxWidth:       520,
      }}
    >
      {/* Window chrome */}
      <div className="px-5 py-4 flex items-center gap-3 border-b"
        style={{ borderColor: "rgba(127,212,160,0.12)" }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }} />
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
            style={{ background: "rgba(127,212,160,0.06)", border: "1px solid rgba(127,212,160,0.12)" }}>
            <div className="text-lg font-bold" style={{ color: GREEN }}>{s.value}</div>
            <div className="text-xs mt-0.5 truncate" style={{ color: TEXT }}>{s.label}</div>
            <div className="text-xs mt-1" style={{ color: s.up ? GREEN : "#F59E0B" }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Request list */}
      <div className="px-4 pb-4 space-y-2">
        {REQUESTS.map(req => (
          <div key={req.id}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(127,212,160,0.08)" }}>
            <div className="w-1.5 h-8 rounded-full flex-shrink-0"
              style={{ background: STATUS_COLOR[req.status] }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: TEXT }}>{req.title}</div>
              <div className="text-xs mt-0.5" style={{ color: MUTED }}>{req.id}</div>
            </div>
            <div className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(127,212,160,0.12)", color: GREEN }}>
              {req.score}%
            </div>
          </div>
        ))}
      </div>

      {/* AI badge */}
      <div className="mx-4 mb-4 rounded-xl p-3 flex items-center gap-2"
        style={{ background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.3)" }}>
        <div className="text-lg">✦</div>
        <div>
          <div className="text-xs font-semibold" style={{ color: TEAL }}>AI Match Active</div>
          <div className="text-xs" style={{ color: MUTED }}>3 providers scored for REQ-041</div>
        </div>
      </div>
    </div>
  );
}
