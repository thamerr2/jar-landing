import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { CheckCircle2, Circle, Clock, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { MaintenanceRequest } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

const TIMELINE: Array<{ status: string; label: string }> = [
  { status: "submitted",    label: "تم الإرسال"   },
  { status: "assigned",     label: "تم الإسناد"   },
  { status: "in_progress",  label: "قيد التنفيذ"  },
  { status: "completed",    label: "اكتمل العمل"   },
  { status: "under_review", label: "قيد المراجعة" },
  { status: "closed",       label: "مغلق"          },
];

const STATUS_ORDER: Record<string, number> = {
  submitted: 0, assigned: 1, in_progress: 2, completed: 3, under_review: 4, closed: 5
};

export default function ResidentRequestDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: request, isLoading } = useQuery<MaintenanceRequest>({
    queryKey: ["request", id],
    queryFn:  () => apiRequest("GET", `/api/maintenance-requests/${id}`)
  });

  const fmt = new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  if (isLoading) {
    return <div className="py-10 text-center text-sm" style={{ color: MUTED }}>{t("common.loading")}</div>;
  }

  if (!request) {
    return <div className="py-10 text-center text-sm" style={{ color: MUTED }}>{t("common.error")}</div>;
  }

  const currentOrder = STATUS_ORDER[request.status] ?? 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold leading-snug" style={{ color: TEXT }}>{request.title}</h1>
        <div className="flex items-center gap-2 mt-1 text-sm flex-wrap" style={{ color: MUTED }}>
          <span>{request.category}</span>
          <span>·</span>
          <span>{request.unit?.unitNumber}</span>
          <span>·</span>
          <span>{fmt.format(new Date(request.createdAt))}</span>
        </div>
      </div>

      <div className="rounded-2xl p-5"
        style={{ border: "1px solid rgba(127,212,160,0.12)", background: "rgba(127,212,160,0.03)" }}>
        <h2 className="text-sm font-semibold mb-5" style={{ color: TEXT }}>{t("resident.requestStatus")}</h2>
        <div className="space-y-0">
          {TIMELINE.map((step, i) => {
            const stepOrder = STATUS_ORDER[step.status] ?? i;
            const done    = stepOrder < currentOrder;
            const current = stepOrder === currentOrder;

            return (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: done || current ? (current ? `${GREEN}22` : `${TEAL}22`) : "rgba(255,255,255,0.06)",
                      border: `2px solid ${done ? TEAL : current ? GREEN : "rgba(255,255,255,0.12)"}`
                    }}>
                    {done    ? <CheckCircle2 size={14} style={{ color: TEAL }} /> :
                     current ? <Clock size={14} style={{ color: GREEN }} /> :
                               <Circle size={14} style={{ color: MUTED }} />}
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="w-0.5 h-8 mt-1"
                      style={{ background: done ? TEAL : "rgba(255,255,255,0.08)" }} />
                  )}
                </div>
                <div className="pb-6 pt-1 flex-1">
                  <div className="text-sm font-medium" style={{
                    color: current ? GREEN : done ? TEXT : MUTED
                  }}>
                    {step.label}
                  </div>
                  {current && (
                    <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                      {fmt.format(new Date(request.updatedAt))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {request.contractor && (
        <div className="rounded-2xl p-5"
          style={{ border: "1px solid rgba(127,212,160,0.12)", background: "rgba(127,212,160,0.03)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: TEXT }}>مزود الخدمة</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: "rgba(127,212,160,0.15)", color: GREEN }}>
              {request.contractor.companyName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: TEXT }}>
                {request.contractor.companyName}
              </div>
              <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: MUTED }}>
                <Star size={11} style={{ color: "#F59E0B" }} />
                {request.contractor.rating.toFixed(1)} · {request.contractor.city}
              </div>
            </div>
          </div>
          {request.contractor.user?.phone && (
            <a
              href={`tel:${request.contractor.user.phone}`}
              className="mt-4 flex items-center justify-center py-2 rounded-xl text-sm border transition-colors"
              style={{ borderColor: "rgba(127,212,160,0.3)", color: GREEN }}
            >
              📞 {request.contractor.user.phone}
            </a>
          )}
        </div>
      )}

      <div className="rounded-2xl p-5"
        style={{ border: "1px solid rgba(127,212,160,0.12)", background: "rgba(127,212,160,0.03)" }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: TEXT }}>الوصف</h2>
        <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{request.description}</p>
      </div>
    </div>
  );
}
