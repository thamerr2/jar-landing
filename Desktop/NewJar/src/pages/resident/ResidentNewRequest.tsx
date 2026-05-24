import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Wrench, Zap, Wind, Paintbrush, SprayCan, HelpCircle, Camera, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Unit } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";
const BG    = "#0D1F1A";

const CATEGORIES = [
  { key: "plumbing",   icon: Wrench,     color: "#60A5FA" },
  { key: "electrical", icon: Zap,        color: "#F59E0B" },
  { key: "hvac",       icon: Wind,       color: TEAL      },
  { key: "painting",   icon: Paintbrush, color: "#A78BFA" },
  { key: "cleaning",   icon: SprayCan,   color: GREEN     },
  { key: "other",      icon: HelpCircle, color: MUTED     },
] as const;

const URGENCIES = ["low", "medium", "high", "emergency"] as const;

const URGENCY_LABELS: Record<string, string> = {
  low: "منخفض", medium: "متوسط", high: "عالٍ", emergency: "طارئ"
};
const URGENCY_COLOR: Record<string, string> = {
  low: MUTED, medium: "#F59E0B", high: "#F97316", emergency: "#EF4444"
};

const detailsSchema = z.object({
  title:       z.string().min(5),
  description: z.string().min(10),
  urgency:     z.enum(URGENCIES),
  unitId:      z.string().min(1),
});

const inputCls   = "w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(127,212,160,0.2)", color: TEXT };

export default function ResidentNewRequest() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState("");

  const { data: units = [] } = useQuery<Unit[]>({
    queryKey: ["my-units"],
    queryFn:  () => apiRequest("GET", "/api/units?mine=true")
  });

  const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { urgency: "medium", unitId: units[0]?.id ?? "" }
  });

  const submit = useMutation({
    mutationFn: (data: z.infer<typeof detailsSchema>) =>
      apiRequest("POST", "/api/maintenance-requests", { ...data, category }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-requests"] });
      qc.invalidateQueries({ queryKey: ["maintenance-requests"] });
      setStep(3);
    }
  });

  if (step === 1) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("resident.newRequest")}</h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>اختر نوع المشكلة</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ key, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => { setCategory(key); setStep(2); }}
              className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-transform hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(127,212,160,0.12)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <span className="text-sm font-medium" style={{ color: TEXT }}>
                {t(`resident.categories.${key}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "rgba(127,212,160,0.15)" }}>
          <CheckCircle2 size={32} style={{ color: GREEN }} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: TEXT }}>تم إرسال طلبك!</h2>
        <p className="text-sm" style={{ color: MUTED }}>سيتم مراجعة طلبك وإسناده قريباً</p>
        <button
          onClick={() => navigate("/resident")}
          className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
        >
          {t("common.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={() => setStep(1)} className="p-1" style={{ color: MUTED }}>←</button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("resident.newRequest")}</h1>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>
            {t(`resident.categories.${category}`)} — التفاصيل
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(d => submit.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>الوحدة</label>
          <select {...register("unitId")} className={inputCls}
            style={{ ...inputStyle, background: "rgba(13,31,26,0.95)" }}>
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.unitNumber}</option>
            ))}
          </select>
          {errors.unitId && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.unitId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>عنوان المشكلة</label>
          <input {...register("title")} placeholder="مثال: تسرب مياه في الحمام"
            className={inputCls} style={inputStyle} />
          {errors.title && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>الوصف التفصيلي</label>
          <textarea {...register("description")} rows={4} placeholder="صف المشكلة بالتفصيل..."
            className={`${inputCls} resize-none`} style={inputStyle} />
          {errors.description && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: MUTED }}>مستوى الأولوية</label>
          <div className="grid grid-cols-4 gap-2">
            {URGENCIES.map(u => {
              const selected = watch("urgency") === u;
              return (
                <label key={u} className="cursor-pointer">
                  <input {...register("urgency")} type="radio" value={u} className="sr-only" />
                  <div className="text-center py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{
                      background: selected ? `${URGENCY_COLOR[u]}22` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selected ? URGENCY_COLOR[u] : "rgba(127,212,160,0.1)"}`,
                      color: selected ? URGENCY_COLOR[u] : MUTED,
                    }}>
                    {URGENCY_LABELS[u]}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: MUTED }}>
          <Camera size={14} />
          <span>إضافة صور (اختياري) — سيتم دعم الرفع قريباً</span>
        </div>

        <button
          type="submit"
          disabled={submit.isPending}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
        >
          {submit.isPending ? t("common.loading") : t("resident.submitRequest")}
        </button>
      </form>
    </div>
  );
}
