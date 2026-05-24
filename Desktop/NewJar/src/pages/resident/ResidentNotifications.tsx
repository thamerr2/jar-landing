import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BellOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

const GREEN = "#7FD4A0";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

export default function ResidentNotifications() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn:  () => apiRequest("GET", "/api/notifications")
  });

  const markRead = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/notifications/${id}/read`, {}),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const prev = qc.getQueryData<Notification[]>(["notifications"]);
      qc.setQueryData<Notification[]>(["notifications"],
        old => old?.map(n => n.id === id ? { ...n, read: true } : n) ?? []
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(["notifications"], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });

  const markAllRead = useMutation({
    mutationFn: () => apiRequest("POST", "/api/notifications/read-all", {}),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });

  const unread = notifications.filter(n => !n.read).length;
  const fmt    = new Intl.DateTimeFormat("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("resident.notifications")}</h1>
          {unread > 0 && (
            <p className="text-xs mt-0.5" style={{ color: GREEN }}>{unread} غير مقروءة</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            className="text-xs px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: GREEN, border: "1px solid rgba(127,212,160,0.3)" }}
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {isLoading && (
        <div className="py-8 text-center text-sm" style={{ color: MUTED }}>{t("common.loading")}</div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="rounded-2xl py-14 text-center"
          style={{ border: "1px solid rgba(127,212,160,0.1)" }}>
          <BellOff size={32} className="mx-auto mb-3" style={{ color: MUTED }} />
          <p className="text-sm" style={{ color: MUTED }}>{t("common.noData")}</p>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => { if (!n.read) markRead.mutate(n.id); }}
            className={cn("rounded-xl px-4 py-3.5 flex items-start gap-3", !n.read && "cursor-pointer")}
            style={{
              background: n.read ? "rgba(255,255,255,0.02)" : "rgba(127,212,160,0.07)",
              border: `1px solid ${n.read ? "rgba(127,212,160,0.08)" : "rgba(127,212,160,0.2)"}`,
            }}
          >
            <div className="mt-1.5 flex-shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ background: n.read ? MUTED : GREEN }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium" style={{ color: n.read ? MUTED : TEXT }}>
                {n.title}
              </div>
              <div className="text-xs mt-0.5 leading-relaxed" style={{ color: MUTED }}>
                {n.body}
              </div>
            </div>
            <div className="text-xs flex-shrink-0 mt-0.5" style={{ color: MUTED }}>
              {fmt.format(new Date(n.createdAt))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
