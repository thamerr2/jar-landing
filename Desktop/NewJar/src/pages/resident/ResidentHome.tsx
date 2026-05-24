import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { MaintenanceRequest, Announcement } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";
const BG    = "#0D1F1A";

const STATUS_COLOR: Record<string, string> = {
  submitted:    "#F59E0B",
  assigned:     TEAL,
  in_progress:  GREEN,
  completed:    "#10B981",
  under_review: "#8B5CF6",
  closed:       MUTED,
};

export default function ResidentHome() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === "ar";
  const Chevron = isRtl ? ChevronLeft : ChevronRight;

  const { data: requests = [] } = useQuery<MaintenanceRequest[]>({
    queryKey: ["my-requests"],
    queryFn:  () => apiRequest("GET", "/api/maintenance-requests?mine=true")
  });

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn:  () => apiRequest("GET", "/api/announcements")
  });

  const active = requests.filter(r => !["completed", "closed"].includes(r.status));
  const fmt    = new Intl.DateTimeFormat("ar-SA", { month: "short", day: "numeric" });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: TEXT }}>
          مرحباً، {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>
          {active.length > 0 ? `لديك ${active.length} طلب نشط` : "لا توجد طلبات نشطة"}
        </p>
      </div>

      <Link href="/resident/new-request">
        <div className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-opacity hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${GREEN}22, ${TEAL}22)`, border: `1px solid ${GREEN}44` }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})` }}>
            <Plus size={18} style={{ color: BG }} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm" style={{ color: TEXT }}>{t("resident.newRequest")}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>أبلغ عن مشكلة في وحدتك</div>
          </div>
          <Chevron size={18} style={{ color: MUTED }} />
        </div>
      </Link>

      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>الطلبات النشطة</h2>
          <div className="space-y-2">
            {active.slice(0, 3).map(r => (
              <Link key={r.id} href={`/resident/requests/${r.id}`}>
                <div className="rounded-xl p-4 flex items-center gap-3 cursor-pointer"
                  style={{ background: "rgba(127,212,160,0.05)", border: "1px solid rgba(127,212,160,0.12)" }}>
                  <div className="w-2 h-10 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLOR[r.status] ?? MUTED }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: TEXT }}>{r.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                      {t(`common.status.${r.status}`)} · {fmt.format(new Date(r.createdAt))}
                    </div>
                  </div>
                  <Chevron size={16} style={{ color: MUTED }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {announcements.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>{t("hoa.announcements")}</h2>
          <div className="space-y-2">
            {announcements.slice(0, 3).map(a => (
              <div key={a.id} className="rounded-xl p-4"
                style={{ background: "rgba(127,212,160,0.04)", border: "1px solid rgba(127,212,160,0.1)" }}>
                <div className="text-sm font-medium" style={{ color: TEXT }}>{a.title}</div>
                <p className="text-xs mt-1 line-clamp-2" style={{ color: MUTED }}>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
