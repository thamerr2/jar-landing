import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Wrench, Wallet, Users, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { MaintenanceRequest, Payment, Contractor } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

const STATUS_COLOR: Record<string, string> = {
  submitted:    "#F59E0B",
  assigned:     TEAL,
  in_progress:  GREEN,
  completed:    "#10B981",
  under_review: "#8B5CF6",
  closed:       MUTED,
};

function KpiCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl p-5"
      style={{ background: "rgba(127,212,160,0.05)", border: "1px solid rgba(127,212,160,0.12)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}>
          <Icon size={17} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: TEXT }}>{value}</div>
      <div className="text-sm font-medium" style={{ color: MUTED }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: MUTED }}>{sub}</div>}
    </div>
  );
}

export default function HoaDashboard() {
  const { t } = useTranslation();

  const { data: requests = [] } = useQuery<MaintenanceRequest[]>({
    queryKey: ["maintenance-requests"],
    queryFn: () => apiRequest("GET", "/api/maintenance-requests")
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: () => apiRequest("GET", "/api/payments")
  });

  const { data: contractors = [] } = useQuery<Contractor[]>({
    queryKey: ["contractors"],
    queryFn: () => apiRequest("GET", "/api/contractors")
  });

  const openCount = requests.filter(r =>
    ["submitted", "assigned", "in_progress"].includes(r.status)
  ).length;

  const pendingPayments = payments
    .filter(p => p.status === "pending" || p.status === "escrow")
    .reduce((sum, p) => sum + p.amount, 0);

  const activeProviders = contractors.filter(c =>
    requests.some(r => r.assignedToId === c.id && r.status === "in_progress")
  ).length;

  const recent = [...requests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 8);

  const fmt = new Intl.DateTimeFormat("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("hoa.dashboard")}</h1>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>
          {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard icon={Wrench} label={t("hoa.openRequests")}    value={openCount}   color={GREEN} />
        <KpiCard icon={Wallet} label={t("hoa.pendingPayments")} value={`${pendingPayments.toLocaleString()} ${t("common.sar")}`} color="#F59E0B" />
        <KpiCard icon={Users}  label={t("hoa.activeProviders")} value={activeProviders} sub={`${contractors.length} registered`} color={TEAL} />
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(127,212,160,0.12)" }}>
        <div className="px-5 py-4 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(127,212,160,0.1)", background: "rgba(127,212,160,0.04)" }}>
          <Clock size={15} style={{ color: GREEN }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>آخر النشاطات</span>
        </div>
        <div className="divide-y divide-white/5">
          {recent.length === 0 && (
            <div className="px-5 py-8 text-center text-sm" style={{ color: MUTED }}>{t("common.noData")}</div>
          )}
          {recent.map(r => (
            <div key={r.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: STATUS_COLOR[r.status] ?? MUTED }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: TEXT }}>{r.title}</div>
                <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                  {r.unit?.unitNumber} · {t(`common.status.${r.status}`)}
                </div>
              </div>
              <div className="text-xs flex-shrink-0" style={{ color: MUTED }}>
                {fmt.format(new Date(r.updatedAt))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
