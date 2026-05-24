import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Sparkles, Star, MapPin, Banknote, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { scoreProviders } from "@/lib/ai-matching";
import type { MaintenanceRequest, Contractor, Property } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

export default function HoaDispatch() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null);
  const [assigned, setAssigned] = useState<string | null>(null);

  const { data: requests = [] } = useQuery<MaintenanceRequest[]>({
    queryKey: ["maintenance-requests"],
    queryFn: () => apiRequest("GET", "/api/maintenance-requests")
  });

  const { data: contractors = [] } = useQuery<Contractor[]>({
    queryKey: ["contractors"],
    queryFn: () => apiRequest("GET", "/api/contractors")
  });

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: () => apiRequest("GET", "/api/properties")
  });

  const assign = useMutation({
    mutationFn: ({ requestId, contractorId }: { requestId: string; contractorId: string }) =>
      apiRequest("PATCH", `/api/maintenance-requests/${requestId}`, {
        assignedToId: contractorId,
        status: "assigned"
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["maintenance-requests"] });
      setAssigned(null);
      setSelected(null);
    }
  });

  const unassigned = requests.filter(r => r.status === "submitted" && !r.assignedToId);

  const scores = selected
    ? scoreProviders(
        selected,
        properties.find(p => p.id === selected.propertyId),
        contractors
      )
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={18} style={{ color: GREEN }} />
        <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("hoa.dispatch")}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: unassigned requests */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(127,212,160,0.12)" }}>
          <div className="px-4 py-3 border-b"
            style={{ borderColor: "rgba(127,212,160,0.1)", background: "rgba(127,212,160,0.04)" }}>
            <span className="text-sm font-semibold" style={{ color: TEXT }}>
              {t("hoa.requests")} — {unassigned.length}
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {unassigned.length === 0 && (
              <div className="px-4 py-8 text-center text-sm" style={{ color: MUTED }}>
                {t("common.noData")}
              </div>
            )}
            {unassigned.map(r => (
              <div
                key={r.id}
                onClick={() => { setSelected(r); setAssigned(null); }}
                className="flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors hover:bg-white/5"
                style={{
                  background: selected?.id === r.id ? "rgba(127,212,160,0.08)" : undefined
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: TEXT }}>{r.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                    {r.category} · {r.unit?.unitNumber ?? r.unitId}
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>
                  {t("common.status.submitted")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI recommendations */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(127,212,160,0.12)" }}>
          <div className="px-4 py-3 border-b flex items-center gap-2"
            style={{ borderColor: "rgba(127,212,160,0.1)", background: "rgba(127,212,160,0.04)" }}>
            <Sparkles size={14} style={{ color: GREEN }} />
            <span className="text-sm font-semibold" style={{ color: TEXT }}>{t("hoa.aiRecommended")}</span>
          </div>

          {!selected && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: MUTED }}>
              اختر طلباً من القائمة لعرض التوصيات
            </div>
          )}

          {selected && scores.length === 0 && (
            <div className="px-4 py-10 text-center text-sm" style={{ color: MUTED }}>
              {t("common.noData")}
            </div>
          )}

          {selected && scores.length > 0 && (
            <div className="p-3 space-y-3">
              {scores.map(({ contractor: c, score, breakdown }, i) => (
                <div
                  key={c.id}
                  className="rounded-xl p-4"
                  style={{
                    background: i === 0 ? "rgba(127,212,160,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 ? "rgba(127,212,160,0.25)" : "rgba(127,212,160,0.08)"}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold" style={{ color: TEXT }}>{c.companyName}</div>
                      <div className="text-xs mt-0.5" style={{ color: MUTED }}>{c.user?.name}</div>
                    </div>
                    <div className="text-lg font-bold" style={{ color: i === 0 ? GREEN : MUTED }}>{score}</div>
                  </div>

                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: MUTED }}>
                    <span className="flex items-center gap-1">
                      <Star size={11} style={{ color: "#F59E0B" }} />{c.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />{c.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Banknote size={11} />{c.hourlyRate} {t("common.sar")}/hr
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {[
                      { label: "تخصص", val: breakdown.category, max: 40 },
                      { label: "موقع", val: breakdown.location,  max: 30 },
                      { label: "تقييم", val: breakdown.rating,   max: 20 },
                      { label: "تكلفة", val: breakdown.cost,     max: 10 },
                    ].map(b => (
                      <div key={b.label} className="text-center">
                        <div className="text-xs font-bold" style={{ color: i === 0 ? GREEN : MUTED }}>{b.val}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{b.label}</div>
                        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                          <div className="h-full rounded-full"
                            style={{ width: `${(b.val / b.max) * 100}%`, background: i === 0 ? GREEN : TEAL }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setAssigned(c.id)}
                    className="w-full py-2 rounded-xl text-sm font-semibold transition-opacity"
                    style={{
                      background: assigned === c.id ? `linear-gradient(135deg, ${GREEN}, ${TEAL})` : "rgba(127,212,160,0.12)",
                      color: assigned === c.id ? "#0D1F1A" : GREEN,
                    }}
                  >
                    {t("hoa.assignProvider")}
                  </button>
                </div>
              ))}

              {assigned && (
                <div className="pt-1">
                  <button
                    onClick={() => assign.mutate({ requestId: selected.id, contractorId: assigned })}
                    disabled={assign.isPending}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: "#0D1F1A" }}
                  >
                    <CheckCircle2 size={15} />
                    {assign.isPending ? t("common.loading") : "تأكيد الإسناد"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
