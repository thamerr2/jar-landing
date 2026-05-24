import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CreditCard, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Payment } from "@/lib/types";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";
const BG    = "#0D1F1A";

const STATUS_COLOR: Record<string, string> = {
  pending:  "#F59E0B",
  escrow:   TEAL,
  released: GREEN,
  refunded: "#8B5CF6",
  failed:   "#EF4444",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "معلق", escrow: "ضمان", released: "محرَّر", refunded: "مُستردّ", failed: "فاشل"
};

export default function ResidentPayments() {
  const { t } = useTranslation();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["my-payments"],
    queryFn:  () => apiRequest("GET", "/api/payments?mine=true")
  });

  const initiateCheckout = useMutation({
    mutationFn: (paymentId: string) =>
      apiRequest<{ checkoutUrl: string }>("POST", "/api/hyperpay/checkout", { paymentId }),
    onSuccess: data => setCheckoutUrl(data.checkoutUrl)
  });

  const pending = payments.filter(p => p.status === "pending");
  const fmt     = new Intl.DateTimeFormat("ar-SA", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold" style={{ color: TEXT }}>{t("resident.payments")}</h1>

      {checkoutUrl && (
        <div className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(127,212,160,0.2)" }}>
          <div className="px-4 py-3 flex items-center gap-2 border-b"
            style={{ borderColor: "rgba(127,212,160,0.1)", background: "rgba(127,212,160,0.06)" }}>
            <Lock size={13} style={{ color: GREEN }} />
            <span className="text-xs font-semibold" style={{ color: GREEN }}>دفع آمن — HyperPay</span>
            <button onClick={() => setCheckoutUrl(null)}
              className="ltr:ml-auto rtl:mr-auto text-xs px-2 py-0.5 rounded" style={{ color: MUTED }}>
              ✕
            </button>
          </div>
          <iframe src={checkoutUrl} className="w-full" height={480} title="HyperPay Checkout" />
        </div>
      )}

      {pending.length > 0 && !checkoutUrl && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold" style={{ color: TEXT }}>مدفوعات مستحقة</h2>
          {pending.map(p => (
            <div key={p.id} className="rounded-2xl p-4"
              style={{ border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold" style={{ color: TEXT }}>
                    {p.request?.title ?? "دفعة صيانة"}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                    {fmt.format(new Date(p.createdAt))}
                  </div>
                </div>
                <div className="text-lg font-bold" style={{ color: "#F59E0B" }}>
                  {p.amount.toLocaleString()} {t("common.sar")}
                </div>
              </div>
              <button
                onClick={() => initiateCheckout.mutate(p.id)}
                disabled={initiateCheckout.isPending}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
              >
                <CreditCard size={15} />
                {initiateCheckout.isPending ? t("common.loading") : "ادفع الآن — مدى / STC Pay / بطاقة"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: TEXT }}>سجل المدفوعات</h2>
        {isLoading ? (
          <div className="py-6 text-center text-sm" style={{ color: MUTED }}>{t("common.loading")}</div>
        ) : payments.length === 0 ? (
          <div className="py-10 text-center rounded-2xl"
            style={{ border: "1px solid rgba(127,212,160,0.1)" }}>
            <CreditCard size={28} className="mx-auto mb-2" style={{ color: MUTED }} />
            <p className="text-sm" style={{ color: MUTED }}>{t("common.noData")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                style={{ background: "rgba(127,212,160,0.04)", border: "1px solid rgba(127,212,160,0.1)" }}>
                <div className="w-1.5 h-8 rounded-full flex-shrink-0"
                  style={{ background: STATUS_COLOR[p.status] ?? MUTED }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: TEXT }}>
                    {p.request?.title ?? p.type ?? "دفعة"}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>
                    {STATUS_LABEL[p.status]} · {fmt.format(new Date(p.createdAt))}
                  </div>
                </div>
                <div className="text-sm font-semibold flex-shrink-0" style={{ color: TEXT }}>
                  {p.amount.toLocaleString()} {t("common.sar")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
