import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Megaphone, Plus, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Announcement } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";
const BG    = "#0D1F1A";

const schema = z.object({
  title: z.string().min(3),
  body:  z.string().min(10),
});

const inputCls   = "w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(127,212,160,0.2)", color: TEXT };

export default function HoaAnnouncements() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn:  () => apiRequest("GET", "/api/announcements"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const create = useMutation({
    mutationFn: (data: z.infer<typeof schema>) =>
      apiRequest("POST", "/api/announcements", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["announcements"] });
      setShowForm(false);
      reset();
    }
  });

  const fmt = new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("hoa.announcements")}</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
        >
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? t("common.cancel") : "إعلان جديد"}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-5"
          style={{ border: "1px solid rgba(127,212,160,0.2)", background: "rgba(127,212,160,0.04)" }}>
          <form onSubmit={handleSubmit(d => create.mutate(d))} className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>العنوان</label>
              <input {...register("title")} className={inputCls} style={inputStyle} />
              {errors.title && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>نص الإعلان</label>
              <textarea {...register("body")} rows={4}
                className={`${inputCls} resize-none`} style={inputStyle} />
              {errors.body && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.body.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || create.isPending}
              className="px-6 py-2 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
            >
              {create.isPending ? t("common.loading") : t("common.save")}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {announcements.length === 0 && (
          <div className="rounded-2xl py-12 text-center"
            style={{ border: "1px solid rgba(127,212,160,0.1)" }}>
            <Megaphone size={32} className="mx-auto mb-3" style={{ color: MUTED }} />
            <p className="text-sm" style={{ color: MUTED }}>{t("common.noData")}</p>
          </div>
        )}
        {announcements.map(a => (
          <div key={a.id} className="rounded-2xl p-5"
            style={{ border: "1px solid rgba(127,212,160,0.12)", background: "rgba(127,212,160,0.03)" }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-sm" style={{ color: TEXT }}>{a.title}</h3>
              <span className="text-xs flex-shrink-0" style={{ color: MUTED }}>
                {fmt.format(new Date(a.createdAt))}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{a.body}</p>
            {a.author && (
              <div className="mt-3 text-xs" style={{ color: MUTED }}>— {a.author.name}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
