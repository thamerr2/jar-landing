import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Landmark, Hammer, Wallet, TrendingUp, Menu, X, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AntiGravityCanvas } from "@/components/AntiGravityCanvas";
import { MockDashboard } from "@/components/MockDashboard";
import { useStickyScroll } from "@/hooks/useStickyScroll";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const BG    = "#0D1F1A";
const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";

function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }
function norm(v: number, lo: number, hi: number) { return clamp((v - lo) / (hi - lo)); }
function spring(t: number) {
  const t2 = clamp(t);
  return 1 - Math.pow(1 - t2, 4) * (1 + 1.4 * t2);
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: MUTED }}>{label}</label>
      {children}
      {error && <p className="text-xs mt-1" style={{ color: "#f87171" }}>{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(127,212,160,0.2)", color: TEXT };

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 animate-zoom-in"
        style={{ background: "rgba(13,31,26,0.97)", border: "1px solid rgba(127,212,160,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          style={{ color: MUTED }}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

function LoginModal({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setServerError("");
    try {
      await login(data.email, data.password);
      onClose();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : t("common.error"));
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-xl font-bold mb-1" style={{ color: TEXT }}>{t("auth.welcomeBack")}</h2>
      <p className="text-sm mb-6" style={{ color: MUTED }}>{t("auth.login")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label={t("auth.email")} error={errors.email?.message}>
          <input {...register("email")} type="email" autoComplete="email" className={inputCls} style={inputStyle} />
        </Field>
        <Field label={t("auth.password")} error={errors.password?.message}>
          <input {...register("password")} type="password" autoComplete="current-password" className={inputCls} style={inputStyle} />
        </Field>
        {serverError && <p className="text-xs" style={{ color: "#f87171" }}>{serverError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
        >
          {isSubmitting ? t("auth.signingIn") : t("auth.loginButton")}
        </button>
      </form>
      <p className="mt-4 text-sm text-center" style={{ color: MUTED }}>
        {t("auth.noAccount")}{" "}
        <button onClick={onSwitch} className="font-semibold" style={{ color: GREEN }}>{t("auth.register")}</button>
      </p>
    </ModalShell>
  );
}

const registerSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
  phone:    z.string().min(9),
  role:     z.enum(["union_admin", "tenant", "contractor", "owner"]),
});

function RegisterModal({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "tenant" }
  });

  const ROLES = [
    { value: "union_admin", label: t("auth.roles.union_admin") },
    { value: "tenant",      label: t("auth.roles.tenant")      },
    { value: "contractor",  label: t("auth.roles.contractor")  },
    { value: "owner",       label: t("auth.roles.owner")       },
  ] as const;

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setServerError("");
    try {
      await registerUser({ ...data });
      onClose();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : t("common.error"));
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <h2 className="text-xl font-bold mb-1" style={{ color: TEXT }}>{t("auth.createAccount")}</h2>
      <p className="text-sm mb-5" style={{ color: MUTED }}>{t("auth.register")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Field label={t("auth.name")} error={errors.name?.message}>
          <input {...register("name")} type="text" autoComplete="name" className={inputCls} style={inputStyle} />
        </Field>
        <Field label={t("auth.email")} error={errors.email?.message}>
          <input {...register("email")} type="email" autoComplete="email" className={inputCls} style={inputStyle} />
        </Field>
        <Field label={t("auth.phone")} error={errors.phone?.message}>
          <input {...register("phone")} type="tel" dir="ltr" className={inputCls} style={inputStyle} />
        </Field>
        <Field label={t("auth.password")} error={errors.password?.message}>
          <input {...register("password")} type="password" className={inputCls} style={inputStyle} />
        </Field>
        <Field label={t("auth.role")} error={errors.role?.message}>
          <select
            {...register("role")}
            className={inputCls}
            style={{ ...inputStyle, background: "rgba(13,31,26,0.95)" }}
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </Field>
        {serverError && <p className="text-xs" style={{ color: "#f87171" }}>{serverError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60 mt-1"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
        >
          {isSubmitting ? t("auth.creatingAccount") : t("auth.registerButton")}
        </button>
      </form>
      <p className="mt-4 text-sm text-center" style={{ color: MUTED }}>
        {t("auth.hasAccount")}{" "}
        <button onClick={onSwitch} className="font-semibold" style={{ color: GREEN }}>{t("auth.login")}</button>
      </p>
    </ModalShell>
  );
}

const contactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  message: z.string().min(10),
});

function ContactSection() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" style={{ background: BG, paddingTop: "5rem", paddingBottom: "5rem" }}>
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10" style={{ color: TEXT }}>
          {t("landing.contact.title")}
        </h2>
        <div className="rounded-2xl p-8"
          style={{ background: "rgba(127,212,160,0.04)", border: "1px solid rgba(127,212,160,0.15)" }}>
          {sent ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✓</div>
              <p className="font-semibold" style={{ color: GREEN }}>تم الإرسال!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label={t("landing.contact.name")}>
                <input {...register("name")} type="text" className={inputCls} style={inputStyle} />
              </Field>
              <Field label={t("landing.contact.email")}>
                <input {...register("email")} type="email" className={inputCls} style={inputStyle} />
              </Field>
              <Field label={t("landing.contact.message")}>
                <textarea {...register("message")} rows={4}
                  className={cn(inputCls, "resize-none")} style={inputStyle} />
              </Field>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
              >
                <Send size={14} />
                {isSubmitting ? t("landing.contact.sending") : t("landing.contact.send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const FEATURE_KEYS = ["ai", "payments", "tracking", "reports"] as const;
const FEATURE_ICONS = [Landmark, Hammer, Wallet, TrendingUp];

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [modal, setModal]             = useState<"login" | "register" | null>(null);
  const [navOpen, setNavOpen]         = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const { containerRef, progress, parallax } = useStickyScroll();

  const textFade   = spring(norm(progress, 0,    0.25));
  const dashReveal = spring(norm(progress, 0.1,  0.55));

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
    localStorage.setItem("i18nextLng", next);
  };

  return (
    <>
      {modal === "login"    && <LoginModal    onClose={() => setModal(null)} onSwitch={() => setModal("register")} />}
      {modal === "register" && <RegisterModal onClose={() => setModal(null)} onSwitch={() => setModal("login")}    />}

      {/* Floating Navbar */}
      <nav className={cn("fixed top-0 inset-x-0 z-40 transition-all duration-300", navScrolled ? "py-2" : "py-4")}>
        <div className={cn(
          "mx-auto max-w-5xl px-4 flex items-center gap-4 rounded-2xl transition-all duration-300",
          navScrolled && "bg-[#0D1F1A]/90 backdrop-blur-xl border border-[#7FD4A0]/20 shadow-lg mx-4"
        )}>
          <div className="flex items-center gap-2 py-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})` }}>
              <Landmark size={14} style={{ color: BG }} />
            </div>
            <span className="font-bold text-lg" style={{ color: TEXT }}>جار</span>
          </div>

          <div className="hidden md:flex items-center gap-6 ltr:ml-auto rtl:mr-auto">
            {(["home", "features", "contact"] as const).map(k => (
              <a key={k} href={`#${k}`} className="text-sm transition-opacity hover:opacity-80" style={{ color: MUTED }}>
                {t(`nav.${k}`)}
              </a>
            ))}
            <button
              onClick={toggleLang}
              className="text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(127,212,160,0.3)", color: MUTED }}
            >
              {i18n.language === "ar" ? "EN" : "ع"}
            </button>
            <button
              onClick={() => setModal("login")}
              className="text-sm px-4 py-1.5 rounded-xl border transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(127,212,160,0.4)", color: GREEN }}
            >
              {t("nav.login")}
            </button>
            <button
              onClick={() => setModal("register")}
              className="text-sm px-4 py-1.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
            >
              {t("nav.register")}
            </button>
          </div>

          <button className="md:hidden ltr:ml-auto rtl:mr-auto p-1.5" onClick={() => setNavOpen(v => !v)}
            style={{ color: TEXT }}>
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {navOpen && (
          <div className="md:hidden mx-4 mt-2 rounded-2xl p-4 space-y-3"
            style={{ background: "rgba(13,31,26,0.97)", border: "1px solid rgba(127,212,160,0.15)" }}>
            {(["home", "features", "contact"] as const).map(k => (
              <a key={k} href={`#${k}`} onClick={() => setNavOpen(false)}
                className="block text-sm py-1" style={{ color: MUTED }}>{t(`nav.${k}`)}</a>
            ))}
            <button onClick={toggleLang} className="block text-sm py-1 w-full text-start" style={{ color: MUTED }}>
              {i18n.language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            </button>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setModal("login"); setNavOpen(false); }}
                className="flex-1 py-2 rounded-xl border text-sm"
                style={{ borderColor: "rgba(127,212,160,0.4)", color: GREEN }}>
                {t("nav.login")}
              </button>
              <button onClick={() => { setModal("register"); setNavOpen(false); }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}>
                {t("nav.register")}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Sticky Hero (300vh) */}
      <section id="home" ref={containerRef} style={{ height: "300vh", background: BG }}>
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
          <AntiGravityCanvas parallaxOffset={parallax} />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 px-6 max-w-5xl mx-auto w-full">
            {/* Hero text */}
            <div
              className="flex-1 text-center md:text-start"
              style={{ opacity: textFade, transform: `translateY(${(1 - textFade) * 24}px)` }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 text-xs"
                style={{ background: "rgba(127,212,160,0.1)", border: "1px solid rgba(127,212,160,0.25)", color: GREEN }}>
                ✦ {t("auth.roles.union_admin")} · {t("auth.roles.tenant")} · {t("auth.roles.contractor")} · {t("auth.roles.owner")}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
                {t("landing.hero.title")}{" "}
                <span style={{
                  background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  {t("landing.hero.titleAccent")}
                </span>
              </h1>
              <p className="text-base md:text-lg max-w-md mb-8" style={{ color: MUTED }}>
                {t("landing.hero.subtitle")}
              </p>
              <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                <button
                  onClick={() => setModal("register")}
                  className="px-6 py-3 rounded-2xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})`, color: BG }}
                >
                  {t("landing.hero.cta")}
                </button>
                <a href="#features"
                  className="px-6 py-3 rounded-2xl text-sm border transition-colors hover:bg-white/5"
                  style={{ borderColor: "rgba(127,212,160,0.3)", color: GREEN }}>
                  {t("landing.hero.learnMore")}
                </a>
              </div>
            </div>

            {/* MockDashboard */}
            <div className="flex-1 flex justify-center" style={{ opacity: dashReveal }}>
              <MockDashboard reveal={dashReveal} />
            </div>
          </div>

          {/* Scroll hint */}
          {progress < 0.05 && (
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce"
              style={{ color: MUTED, opacity: 1 - progress * 20 }}
            >
              <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
                style={{ borderColor: "rgba(127,212,160,0.4)" }}>
                <div className="w-1 h-2 rounded-full" style={{ background: GREEN }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ background: BG, paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: TEXT }}>
            {t("landing.features.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURE_KEYS.map((key, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <div key={key} className="rounded-2xl p-6 transition-transform hover:-translate-y-1"
                  style={{ background: "rgba(127,212,160,0.05)", border: "1px solid rgba(127,212,160,0.15)" }}>
                  <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: "rgba(127,212,160,0.12)" }}>
                    <Icon size={20} style={{ color: GREEN }} />
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: TEXT }}>
                    {t(`landing.features.${key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
                    {t(`landing.features.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />

      {/* Footer */}
      <footer style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(127,212,160,0.1)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})` }}>
              <Landmark size={12} style={{ color: BG }} />
            </div>
            <span className="font-semibold text-sm" style={{ color: TEXT }}>جار</span>
          </div>
          <p className="text-xs" style={{ color: MUTED }}>
            © {new Date().getFullYear()} {t("landing.footer.platform")} — {t("landing.footer.rights")}
          </p>
        </div>
      </footer>
    </>
  );
}
