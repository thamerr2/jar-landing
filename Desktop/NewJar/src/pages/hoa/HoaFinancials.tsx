import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { apiRequest } from "@/lib/queryClient";
import type { Payment } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

const STATUS_LABEL: Record<string, string> = {
  pending:  "معلق",
  escrow:   "ضمان",
  released: "محرَّر",
  refunded: "مُستردّ",
  failed:   "فاشل",
};

const STATUS_COLOR: Record<string, string> = {
  pending:  "#F59E0B",
  escrow:   TEAL,
  released: GREEN,
  refunded: "#8B5CF6",
  failed:   "#EF4444",
};

export default function HoaFinancials() {
  const { t } = useTranslation();

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn:  () => apiRequest("GET", "/api/payments")
  });

  const total    = payments.reduce((s, p) => s + p.amount, 0);
  const escrow   = payments.filter(p => p.status === "escrow").reduce((s, p) => s + p.amount, 0);
  const released = payments.filter(p => p.status === "released").reduce((s, p) => s + p.amount, 0);

  const byMonth: Record<string, number> = {};
  payments.forEach(p => {
    const key = new Date(p.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "short" });
    byMonth[key] = (byMonth[key] ?? 0) + p.amount;
  });
  const chartData = Object.entries(byMonth)
    .map(([month, amount]) => ({ month, amount }))
    .slice(-6);

  const fmt = new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("hoa.financials")}</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي المعاملات", value: total,    color: GREEN },
          { label: "قيد الضمان",       value: escrow,   color: TEAL  },
          { label: "تم الإفراج",        value: released, color: "#10B981" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4"
            style={{ border: "1px solid rgba(127,212,160,0.12)", background: "rgba(127,212,160,0.04)" }}>
            <div className="text-xl font-bold" style={{ color: s.color }}>
              {s.value.toLocaleString()} {t("common.sar")}
            </div>
            <div className="text-xs mt-1" style={{ color: MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="rounded-2xl p-5"
          style={{ border: "1px solid rgba(127,212,160,0.12)", background: "rgba(127,212,160,0.03)" }}>
          <div className="text-sm font-semibold mb-4" style={{ color: TEXT }}>المدفوعات الشهرية</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0D1F1A", border: "1px solid rgba(127,212,160,0.2)", borderRadius: 12, color: TEXT }}
                cursor={{ fill: "rgba(127,212,160,0.06)" }}
              />
              <Bar dataKey="amount" fill={GREEN} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(127,212,160,0.12)" }}>
        <div className="px-5 py-3 border-b"
          style={{ borderColor: "rgba(127,212,160,0.1)", background: "rgba(127,212,160,0.04)" }}>
          <span className="text-sm font-semibold" style={{ color: TEXT }}>
            {t("hoa.financials")} ({payments.length})
          </span>
        </div>
        {isLoading ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: MUTED }}>{t("common.loading")}</div>
        ) : payments.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm" style={{ color: MUTED }}>{t("common.noData")}</div>
        ) : (
          <div className="divide-y divide-white/5">
            {payments.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: TEXT }}>
                    {p.request?.title ?? p.type ?? "دفعة"}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                    {fmt.format(new Date(p.createdAt))}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${STATUS_COLOR[p.status] ?? MUTED}20`, color: STATUS_COLOR[p.status] ?? MUTED }}>
                  {STATUS_LABEL[p.status] ?? p.status}
                </span>
                <span className="text-sm font-semibold flex-shrink-0" style={{ color: TEXT }}>
                  {p.amount.toLocaleString()} {t("common.sar")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
