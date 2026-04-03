import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import {
  Landmark, Hammer, Wallet, TrendingUp,
  Sun, Moon, Menu, X, Star,
  ChevronLeft, ChevronRight, Mail, Phone, Clock, Send,
  CheckCircle2, ArrowLeft, Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// ─── Brand ────────────────────────────────────────────────────────────────────
const NAVY = "#0D1B1E";
const MINT = "#88D9B0";
const GOLD = "#F59E0B";
const TEAL = "#2A9D8F";

// ─── Easing util ─────────────────────────────────────────────────────────────
function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }
function norm(v: number, lo: number, hi: number) { return clamp((v - lo) / (hi - lo)); }
// cubic-bezier(0.16, 1, 0.3, 1) approximation
function spring(t: number) {
  const t2 = clamp(t);
  return 1 - Math.pow(1 - t2, 4) * (1 + 1.4 * t2);
}

// ─── Anti-gravity particle canvas ─────────────────────────────────────────────
const PCOLS = [MINT, "#4CAF82", "#A8E6C3", "#1E6B8A", "#55B8D0", GOLD, TEAL];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
  opacity: number; baseOpacity: number;
  isDash: boolean; dashAngle: number; dashLen: number;
  driftSpeed: number; driftPhase: number; driftAmp: number;
}

function mkP(W: number, H: number): Particle {
  const a = Math.random() * Math.PI * 2;
  const r = 40 + Math.random() * Math.min(W, H) * 0.45;
  return {
    x:           W / 2 + Math.cos(a) * r,
    y:           H / 2 + Math.sin(a) * r,
    vx:          Math.cos(a + Math.PI / 2) * (0.06 + Math.random() * 0.18) * (Math.random() > 0.5 ? 1 : -1),
    vy:          -(0.05 + Math.random() * 0.2),
    size:        0.7 + Math.random() * 2.4,
    color:       PCOLS[Math.floor(Math.random() * PCOLS.length)],
    opacity:     0,
    baseOpacity: 0.08 + Math.random() * 0.36,
    isDash:      Math.random() > 0.42,
    dashAngle:   Math.random() * Math.PI * 2,
    dashLen:     4 + Math.random() * 12,
    driftSpeed:  0.3 + Math.random() * 0.7,
    driftPhase:  Math.random() * Math.PI * 2,
    driftAmp:    0.2 + Math.random() * 0.5,
  };
}

function AntiGravityCanvas({ parallaxOffset = 0 }: { parallaxOffset?: number }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const offsetRef  = useRef(parallaxOffset);
  offsetRef.current = parallaxOffset;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let tick = 0;
    let particles: Particle[] = Array.from({ length: 80 }, () => mkP(canvas.width, canvas.height));
    let raf: number;

    const draw = () => {
      tick++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Vignette fade
      const cx = W / 2, cy = H / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
      grad.addColorStop(0,   "rgba(255,255,255,0)");
      grad.addColorStop(0.58,"rgba(255,255,255,0)");
      grad.addColorStop(1,   "rgba(255,255,255,0.96)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p, i) => {
        const drift = Math.sin(tick * 0.008 * p.driftSpeed + p.driftPhase) * p.driftAmp;
        p.x += p.vx + drift;
        p.y += p.vy + offsetRef.current * 0.0006;
        p.opacity = Math.min(p.baseOpacity, p.opacity + 0.003);

        if (p.y < -20 || p.x < -20 || p.x > W + 20) {
          particles[i] = mkP(W, H);
          particles[i].y = H + 10;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = ctx.strokeStyle = p.color;

        if (p.isDash) {
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap   = "round";
          ctx.translate(p.x, p.y);
          ctx.rotate(p.dashAngle);
          ctx.beginPath();
          ctx.moveTo(-p.dashLen / 2, 0);
          ctx.lineTo(p.dashLen / 2, 0);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }} />
  );
}

// ─── JS-Sticky hook ───────────────────────────────────────────────────────────
// Bypasses CSS sticky (broken by overflow-x:hidden on parent) by computing
// position: fixed while inside the scroll range, absolute before/after.
type StickyPhase = "before" | "active" | "after";

function useStickyScroll(wrapRef: React.RefObject<HTMLDivElement>) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState<StickyPhase>("before");
  const [wrapTop, setWrapTop]   = useState(0);   // offsetTop of wrapper

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setWrapTop(wrapRef.current.offsetTop);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [wrapRef]);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const scrollY    = window.scrollY;
      const wHeight    = el.offsetHeight;
      const vHeight    = window.innerHeight;
      const scrollRange = wHeight - vHeight;
      const entered    = scrollY - wrapTop;

      if (entered < 0) {
        setPhase("before"); setProgress(0);
      } else if (entered >= scrollRange) {
        setPhase("after"); setProgress(1);
      } else {
        setPhase("active");
        setProgress(entered / scrollRange);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [wrapRef, wrapTop]);

  // CSS position style for the sticky inner div
  const stickyStyle: React.CSSProperties =
    phase === "active"
      ? { position: "fixed",    top: 0, left: 0, right: 0, height: "100vh" }
      : phase === "after"
      ? { position: "absolute", bottom: 0, left: 0, right: 0, height: "100vh" }
      : { position: "absolute", top: 0,    left: 0, right: 0, height: "100vh" };

  return { progress, phase, stickyStyle };
}

// ─── Mock Dashboard ───────────────────────────────────────────────────────────
function MockDashboard({ reveal }: { reveal: number }) {
  // reveal: 0→1.  each card gets a staggered sub-range.
  const cs = (start: number, range = 0.22) => {
    const t = spring(norm(reveal, start, start + range));
    return {
      opacity:    t,
      transform:  `scale(${0.86 + 0.14 * t}) translateY(${(1 - t) * 16}px)`,
      filter:     `blur(${(1 - t) * 8}px)`,
      transition: "none",
    } satisfies React.CSSProperties;
  };

  const stats = [
    { label: "العقارات",  value: "12",  color: "#1E6B8A", icon: <Landmark className="w-3.5 h-3.5" /> },
    { label: "العقود",    value: "47",  color: MINT,      icon: <Users    className="w-3.5 h-3.5" /> },
    { label: "الصيانة",  value: "8",   color: GOLD,      icon: <Hammer   className="w-3.5 h-3.5" /> },
    { label: "الإيرادات", value: "42K", color: TEAL,      icon: <Wallet   className="w-3.5 h-3.5" /> },
  ];

  const maint = [
    { title: "تسرب مياه",      status: "عاجل",          dot: "#EF4444" },
    { title: "كهرباء المطبخ",  status: "قيد التنفيذ",   dot: GOLD     },
    { title: "صيانة مكيف",    status: "مكتمل",          dot: MINT     },
  ];

  const props = [
    { name: "برج الرياض",  pct: 92, color: MINT  },
    { name: "فيلا جدة",    pct: 75, color: GOLD  },
    { name: "شقق الدمام",  pct: 58, color: TEAL  },
  ];

  return (
    <div className="w-full rounded-3xl overflow-hidden"
      style={{
        background: "#F8FAFC",
        border:     `0.5px solid rgba(136,217,176,0.4)`,
        boxShadow:  `0 32px 80px rgba(13,27,30,0.22), 0 0 0 0.5px rgba(136,217,176,0.15)`,
        maxWidth:   800,
        margin:     "0 auto",
      }}>

      {/* Titlebar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: NAVY }}>
        {["#EF4444","#F59E0B","#22C55E"].map(c => (
          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
        ))}
        <div className="flex-1 mx-3">
          <div className="h-4 rounded-full w-44 mx-auto flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.07)", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>
            app.jar.sa/dashboard
          </div>
        </div>
      </div>

      <div className="flex" style={{ height: 400 }}>
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col gap-1.5 p-2.5 w-14 shrink-0"
          style={{ background: NAVY, borderRight: `0.5px solid rgba(136,217,176,0.1)` }}>
          {[Landmark, Hammer, Wallet, TrendingUp].map((Icon, i) => (
            <div key={i} className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto"
              style={{
                background: i === 0 ? "rgba(136,217,176,0.18)" : "rgba(255,255,255,0.05)",
                color:      i === 0 ? MINT : "rgba(255,255,255,0.35)",
              }}>
              <Icon className="w-3.5 h-3.5" />
              {i === 0 && (
                <div className="absolute inset-y-[20%] start-0 w-0.5 rounded-e-full"
                  style={{ background: MINT, boxShadow: `0 0 6px ${MINT}` }} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-hidden">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-2.5"
                style={{
                  background: "white",
                  border:     `0.5px solid rgba(136,217,176,0.25)`,
                  boxShadow:  "0 2px 12px rgba(0,0,0,0.04)",
                  ...cs(i * 0.07),
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400" style={{ fontSize: 9 }}>{s.label}</span>
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center"
                    style={{ background: `${s.color}18`, color: s.color }}>
                    {s.icon}
                  </span>
                </div>
                <p className="font-black text-lg" style={{ color: NAVY }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            {/* Area chart */}
            <div className="rounded-2xl p-3 flex flex-col"
              style={{
                background: "white",
                border:     `0.5px solid rgba(136,217,176,0.25)`,
                ...cs(0.28),
              }}>
              <p className="text-xs font-semibold mb-2" style={{ color: NAVY, fontSize: 10 }}>
                الإيرادات الشهرية
              </p>
              <svg viewBox="0 0 200 64" className="w-full flex-1" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lmg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={MINT} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={MINT} stopOpacity="0"   />
                  </linearGradient>
                </defs>
                <path d="M0,60 C18,52 32,34 52,30 C72,26 88,38 108,34 C128,30 144,18 164,12 C176,8 188,6 200,4 L200,64 L0,64 Z"
                  fill="url(#lmg)" />
                <path d="M0,60 C18,52 32,34 52,30 C72,26 88,38 108,34 C128,30 144,18 164,12 C176,8 188,6 200,4"
                  fill="none" stroke={MINT} strokeWidth="2" strokeLinecap="round" />
                {/* data dots */}
                {[[52,30],[108,34],[164,12],[200,4]].map(([x,y],i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill={MINT} opacity="0.8" />
                ))}
              </svg>
            </div>

            {/* Maintenance list */}
            <div className="rounded-2xl p-3"
              style={{
                background: "white",
                border:     `0.5px solid rgba(136,217,176,0.25)`,
                ...cs(0.38),
              }}>
              <p className="font-semibold mb-2.5" style={{ color: NAVY, fontSize: 10 }}>
                طلبات الصيانة
              </p>
              <div className="space-y-2">
                {maint.map((m, i) => (
                  <div key={i} className="flex items-center justify-between" style={cs(0.44 + i * 0.1)}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: m.dot, boxShadow: `0 0 4px ${m.dot}` }} />
                      <span style={{ fontSize: 10, color: NAVY }}>{m.title}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ fontSize: 9, background: `${m.dot}18`, color: m.dot }}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property cards */}
          <div className="grid grid-cols-3 gap-2">
            {props.map((prop, i) => (
              <div key={i} className="rounded-2xl p-2.5"
                style={{
                  background: "white",
                  border:     `0.5px solid rgba(136,217,176,0.25)`,
                  ...cs(0.72 + i * 0.08),
                }}>
                <p className="font-semibold truncate mb-0.5" style={{ color: NAVY, fontSize: 10 }}>
                  {prop.name}
                </p>
                <p className="mb-1.5" style={{ fontSize: 9, color: "rgba(13,27,30,0.45)" }}>
                  {prop.pct}% مأهول
                </p>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(13,27,30,0.08)" }}>
                  <div className="h-full rounded-full transition-none"
                    style={{ width: `${prop.pct * clamp(norm(reveal, 0.72 + i * 0.08, 1))}%`, background: prop.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section Reveal ───────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Landing page ─────────────────────────────────────────────────────────────
export default function Landing() {
  const { t, i18n }  = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isAr = i18n.language === "ar";

  const [navScrolled,    setNavScrolled]    = useState(false);
  const [navOpen,        setNavOpen]        = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [contactSent,    setContactSent]    = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [contactForm,    setContactForm]    = useState({ name: "", email: "", phone: "", message: "" });
  const [scrollY,        setScrollY]        = useState(0);

  // ── JS sticky refs
  const wrapRef = useRef<HTMLDivElement>(null);
  const { progress, stickyStyle } = useStickyScroll(wrapRef);

  // Derived animation values ─────────────────────────────────────────────────
  // Hero text: fade from 0→0.28
  const heroT    = spring(norm(progress, 0, 0.28));
  const heroOp   = 1 - heroT;
  const heroY    = heroT * -55;

  // Dashboard: appears 0.18→0.62, fully clear by 0.62
  const dashT    = spring(norm(progress, 0.18, 0.62));
  const dashOp   = dashT;
  const dashScale = 0.68 + 0.32 * dashT;
  const dashBlur  = (1 - dashT) * 18;

  // Card internals: 0.5→1.0
  const revealP  = norm(progress, 0.5, 1.0);

  // Parallax: move particles opposite to scroll inside sticky zone
  const paralOff = progress * 80;

  // ── navbar shadow
  useEffect(() => {
    const fn = () => { setNavScrolled(window.scrollY > 24); setScrollY(window.scrollY); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── testimonials auto-advance
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  const featS = useInView();
  const testS = useInView();
  const contS = useInView();

  const navLinks = [
    { label: t("landing.navFeatures"), href: "#features"     },
    { label: t("landing.navReviews"),  href: "#testimonials" },
    { label: t("landing.navContact"),  href: "#contact"      },
  ];

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault(); setContactSending(true);
    await new Promise(r => setTimeout(r, 900));
    setContactSending(false); setContactSent(true);
  };

  return (
    // NOTE: no overflow-x-hidden here — that breaks position:sticky/fixed
    <div className="min-h-screen bg-white" style={{ fontFamily: "'IBM Plex Sans Arabic','Cairo',sans-serif" }}>

      {/* ── Overflow clip wrapper (clips horizontal only, doesn't affect sticky) */}
      <style>{`body { overflow-x: hidden; }`}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-4 z-50 rounded-2xl transition-all duration-500"
        style={{
          top: navScrolled ? 8 : 12,
          background: navScrolled ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.70)",
          backdropFilter:         "blur(24px)",
          WebkitBackdropFilter:   "blur(24px)",
          border:    `0.5px solid ${navScrolled ? "rgba(136,217,176,0.4)" : "rgba(136,217,176,0.2)"}`,
          boxShadow: navScrolled
            ? "0 8px 40px rgba(13,27,30,0.12), 0 0 0 0.5px rgba(136,217,176,0.12)"
            : "0 4px 20px rgba(13,27,30,0.05)",
        }}>
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2.5 shrink-0">
              <img src="/logo.svg" alt="Jar" className="w-8 h-8 rounded-xl object-contain" />
              <span className="text-base font-black hidden sm:block" style={{ color: NAVY }}>
                {isAr ? "منصة جار" : "Jar Platform"}
              </span>
            </a>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex gap-7 text-sm font-semibold flex-1 justify-center">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="opacity-55 hover:opacity-100 transition-opacity"
                style={{ color: NAVY }}>{l.label}</a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
              style={{ color: NAVY, background: `${MINT}22` }}>
              {isAr ? "EN" : "عر"}
            </button>
            <button onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center opacity-55 hover:opacity-100 transition-opacity"
              style={{ color: NAVY }}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="hidden md:flex gap-2">
              <Link href="/login">
                <a className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: `${NAVY}30`, color: NAVY }}>
                  {t("auth.login")}
                </a>
              </Link>
              <Link href="/register">
                <a className="px-4 py-1.5 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.03]"
                  style={{ background: NAVY }}>
                  {t("landing.getStarted")}
                </a>
              </Link>
            </div>
            <button className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: NAVY }} onClick={() => setNavOpen(p => !p)}>
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="md:hidden px-5 py-4 flex flex-col gap-3 text-sm font-semibold rounded-b-2xl border-t"
            style={{ borderColor: `${NAVY}10`, background: "rgba(255,255,255,0.96)" }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setNavOpen(false)} style={{ color: NAVY }}>{l.label}</a>
            ))}
            <div className="flex gap-2 pt-2 border-t" style={{ borderColor: `${NAVY}10` }}>
              <Link href="/login">
                <a className="flex-1 text-center px-4 py-2 rounded-full text-sm font-semibold border"
                  style={{ borderColor: `${NAVY}30`, color: NAVY }}>
                  {t("auth.login")}
                </a>
              </Link>
              <Link href="/register">
                <a className="flex-1 text-center px-4 py-2 rounded-full text-sm font-bold text-white"
                  style={{ background: NAVY }}>
                  {t("landing.getStarted")}
                </a>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── STICKY SCROLL STORYTELLING ──────────────────────────────────────── */}
      {/*
          Outer wrapper is 300vh tall — this is what the user scrolls through.
          Inner "stage" uses JS-computed position:fixed (active) or absolute (before/after).
          This bypasses CSS sticky being blocked by overflow:hidden on ancestors.
      */}
      <div ref={wrapRef} className="relative" style={{ height: "300vh" }}>
        {/* ── Stage: JS-positioned ─────────────────────────────────────────── */}
        <div style={{ ...stickyStyle, overflow: "hidden" }}>

          {/* Layer 0 – white base */}
          <div className="absolute inset-0 bg-white" />

          {/* Layer 1 – Particles (parallax: shift upward as progress increases) */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateY(${-paralOff}px)`, willChange: "transform" }}>
            <AntiGravityCanvas parallaxOffset={paralOff} />
          </div>

          {/* Layer 2 – Concentric rings (fade out as hero fades) */}
          <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: heroOp * 0.9, transform: `translateY(${heroY * 0.4}px)` }}>
            {[440, 310, 200].map((r, i) => (
              <div key={r} className="absolute rounded-full"
                style={{
                  width: r * 2, height: r * 2,
                  border: `0.5px solid ${MINT}`,
                  opacity: 0.08 - i * 0.022,
                }} />
            ))}
          </div>

          {/* Layer 3 – Hero text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{
              opacity:   heroOp,
              transform: `translateY(${heroY}px)`,
              pointerEvents: progress > 0.15 ? "none" : "auto",
              zIndex: 10,
            }}>
            <div className="text-center max-w-4xl mx-auto select-none">
              {/* Over-title */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
                style={{ background: `${NAVY}0C`, border: `0.5px solid ${MINT}55`, color: NAVY }}>
                <img src="/logo.svg" alt="" className="w-5 h-5 rounded-md" />
                {t("landing.overTitle")}
              </div>

              {/* Headline */}
              <h1 className="font-black tracking-tight mb-6"
                style={{
                  fontSize: "clamp(1.85rem, 5vw, 3.75rem)",
                  color:    NAVY,
                  lineHeight: 1.5,
                  letterSpacing: isAr ? "0.01em" : "-0.02em",
                }}>
                {t("landing.heroTitle1")}
                <br />
                <span style={{
                  background: `linear-gradient(135deg, ${MINT}, ${TEAL})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                }}>
                  {t("landing.heroTitle2")}
                </span>
              </h1>

              {/* Sub */}
              <p className="text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed"
                style={{ color: `${NAVY}99` }}>
                {t("landing.heroSub")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <a className="inline-flex items-center gap-2 px-9 py-3.5 rounded-full text-base font-bold text-white shadow-xl
                    transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl active:scale-[0.97]"
                    style={{ background: NAVY }}>
                    {t("landing.getStarted")}
                    <ArrowLeft className={cn("w-4 h-4", !isAr && "rotate-180")} />
                  </a>
                </Link>
                <a href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold
                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    border:     `1.5px solid ${NAVY}30`,
                    color:      NAVY,
                    background: `${NAVY}06`,
                    backdropFilter: "blur(8px)",
                  }}>
                  {t("landing.bookDemo")}
                </a>
              </div>

              {/* Scroll hint */}
              <div className="mt-14 flex flex-col items-center gap-2" style={{ opacity: 0.38 }}>
                <p className="text-xs font-medium" style={{ color: NAVY }}>
                  {isAr ? "مرر للأسفل لاستكشاف المنصة" : "Scroll to explore"}
                </p>
                <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
                  style={{ borderColor: `${NAVY}40` }}>
                  <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: MINT }} />
                </div>
              </div>
            </div>
          </div>

          {/* Layer 4 – Radial glow behind dashboard */}
          <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: dashOp * 0.7,
              zIndex: 15,
              transform: `translateY(${paralOff * 0.04}px)`,
            }}>
            <div style={{
              width: "min(90vw, 900px)",
              height: "60vh",
              borderRadius: "50%",
              background: `radial-gradient(ellipse at center, ${MINT}22 0%, transparent 68%)`,
              filter: "blur(24px)",
            }} />
          </div>

          {/* Layer 5 – Dashboard zoom-reveal */}
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-12 pointer-events-none"
            style={{
              opacity:   dashOp,
              transform: `scale(${dashScale})`,
              filter:    `blur(${dashBlur}px)`,
              zIndex:    20,
              willChange: "transform, opacity, filter",
            }}>
            <MockDashboard reveal={revealP} />
          </div>

          {/* Layer 6 – "Scrolling to explore" label when dashboard is visible */}
          {progress > 0.65 && progress < 0.95 && (
            <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none" style={{ zIndex: 30 }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{
                  background:   "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  border:       `0.5px solid ${MINT}40`,
                  color:        NAVY,
                  opacity:      Math.min(1, (progress - 0.65) / 0.1) * Math.max(0, 1 - (progress - 0.88) / 0.07),
                }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: MINT }} />
                {isAr ? "استمر في التمرير" : "Keep scrolling"}
              </div>
            </div>
          )}

          {/* Bottom fade-to-white */}
          <div aria-hidden className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
            style={{ background: "linear-gradient(to top, white, transparent)", zIndex: 35 }} />
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-5 max-w-6xl mx-auto" ref={featS.ref}>
        <div className={cn("text-center mb-16 transition-all duration-700",
          featS.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <h2 className="text-4xl font-black mb-4"
            style={{ color: NAVY, fontFamily: "'IBM Plex Sans Arabic','Cairo',sans-serif" }}>
            {t("landing.featuresTitle")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.featuresSubtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.key}
                className={cn("rounded-3xl p-6 transition-all duration-700 group cursor-default",
                  featS.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}
                style={{
                  transitionDelay: `${i * 80}ms`,
                  background: "white",
                  border:     `0.5px solid rgba(136,217,176,0.25)`,
                  boxShadow:  "0 8px 32px rgba(13,27,30,0.05)",
                }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.bg }}>
                  <Icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-bold mb-2 text-base" style={{ color: NAVY }}>
                  {t(`landing.features.${f.key}`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`landing.features.${f.key}Sub`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-5" ref={testS.ref}
        style={{ background: `${NAVY}04` }}>
        <div className="max-w-3xl mx-auto">
          <div className={cn("text-center mb-12 transition-all duration-700",
            testS.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <h2 className="text-4xl font-black mb-4"
              style={{ color: NAVY, fontFamily: "'IBM Plex Sans Arabic','Cairo',sans-serif" }}>
              {t("landing.testimonialsTitle")}
            </h2>
          </div>

          <div className="rounded-3xl p-8 text-center min-h-[200px] flex flex-col items-center justify-center"
            style={{
              background: "white",
              border:     `0.5px solid rgba(136,217,176,0.3)`,
              boxShadow:  "0 20px 60px rgba(13,27,30,0.08)",
            }}>
            <div className="flex gap-1 mb-5">
              {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: GOLD }} />
              ))}
            </div>
            <blockquote className="text-lg text-muted-foreground italic mb-6 max-w-xl leading-relaxed">
              "{testimonials[testimonialIdx].text}"
            </blockquote>
            <p className="font-bold" style={{ color: NAVY }}>{testimonials[testimonialIdx].name}</p>
            <p className="text-sm text-muted-foreground">{testimonials[testimonialIdx].role}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ background: `${NAVY}0D` }}
              onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}>
              <ChevronLeft className="w-4 h-4" style={{ color: NAVY }} />
            </button>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: i === testimonialIdx ? 24 : 8, height: 8,
                  background: i === testimonialIdx ? MINT : `${NAVY}30` }} />
            ))}
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              style={{ background: `${NAVY}0D` }}
              onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)}>
              <ChevronRight className="w-4 h-4" style={{ color: NAVY }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-5 max-w-5xl mx-auto" ref={contS.ref}>
        <div className={cn("text-center mb-14 transition-all duration-700",
          contS.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
          <h2 className="text-4xl font-black mb-4"
            style={{ color: NAVY, fontFamily: "'IBM Plex Sans Arabic','Cairo',sans-serif" }}>
            {t("landing.contactTitle")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("landing.contactSubtitle")}</p>
        </div>

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-10 items-start transition-all duration-700 delay-100",
          contS.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>

          {/* Info */}
          <div className="space-y-4">
            {[
              { Icon: Mail,  color: MINT, label: t("landing.contactEmail"),       value: t("landing.contactInfoEmail")  },
              { Icon: Phone, color: TEAL, label: t("landing.contactPhoneLabel"),  value: "+966 11 XXX XXXX"              },
              { Icon: Clock, color: GOLD, label: t("landing.contactHoursLabel"),  value: t("landing.contactInfoHours")  },
            ].map(({ Icon, color, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: `${color}14` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: color }}>
                  <Icon className="w-5 h-5" style={{ color: color === MINT ? NAVY : "white" }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                  <p className="font-bold text-sm" style={{ color: NAVY }}>{value}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl" style={{ border: `0.5px solid ${MINT}40`, background: `${MINT}08` }}>
              <p className="font-bold mb-3 text-sm" style={{ color: NAVY }}>
                {t("landing.contactDemoIncludes")}
              </p>
              {[1,2,3,4].map(n => (
                <div key={n} className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: MINT }} />
                  {t(`landing.contactDemo${n}`)}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl p-7"
            style={{
              background: "white",
              border:     `0.5px solid rgba(136,217,176,0.3)`,
              boxShadow:  "0 20px 60px rgba(13,27,30,0.08)",
            }}>
            {contactSent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${MINT}25` }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: TEAL }} />
                </div>
                <p className="font-bold text-lg mb-2" style={{ color: NAVY }}>{t("landing.contactSentTitle")}</p>
                <p className="text-muted-foreground text-sm">{t("landing.contactSent")}</p>
                <button className="mt-5 px-6 py-2 rounded-full text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: `${NAVY}30`, color: NAVY }}
                  onClick={() => { setContactSent(false); setContactForm({ name:"",email:"",phone:"",message:"" }); }}>
                  {t("landing.contactSendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                {[
                  { key:"name",  label:t("landing.contactName"),  type:"text",  req:true  },
                  { key:"email", label:t("landing.contactEmail"), type:"email", req:true  },
                  { key:"phone", label:t("landing.contactPhone"), type:"tel",   req:false },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: NAVY }}>
                      {f.label}{f.req ? " *" : ""}
                    </label>
                    <Input type={f.type} value={(contactForm as any)[f.key]}
                      onChange={e => setContactForm(p => ({ ...p, [f.key]: e.target.value }))}
                      required={f.req} className="h-11 rounded-xl"
                      style={{ borderColor: "rgba(136,217,176,0.45)" }} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: NAVY }}>
                    {t("landing.contactMessage")}
                  </label>
                  <textarea value={contactForm.message}
                    onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                    rows={3} className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none resize-none focus:ring-2"
                    style={{ borderColor: "rgba(136,217,176,0.45)", "--tw-ring-color": MINT } as any} />
                </div>
                <button type="submit" disabled={contactSending}
                  className="w-full h-11 text-white rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01]"
                  style={{ background: NAVY }}>
                  {contactSending
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("landing.contactSending")}</>
                    : <><Send className="w-4 h-4" />{t("landing.contactSend")}</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t py-10 px-5 text-center text-sm"
        style={{ borderColor: `${NAVY}10`, color: `${NAVY}55` }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/logo.svg" alt="Jar" className="w-7 h-7 rounded-lg" />
          <span className="font-bold text-base" style={{ color: NAVY }}>
            {isAr ? "منصة جار" : "Jar Platform"}
          </span>
        </div>
        <p>{t("landing.footer")}</p>
      </footer>
    </div>
  );
}

// ─── Static data (outside component to avoid recreating) ─────────────────────
const FEATURES = [
  { key:"property",    icon:Landmark,   color:NAVY,      bg:`${MINT}26`                },
  { key:"maintenance", icon:Hammer,     color:TEAL,      bg:`${TEAL}1E`                },
  { key:"payments",    icon:Wallet,     color:"#1E6B8A", bg:"rgba(30,107,138,0.12)"    },
  { key:"analytics",   icon:TrendingUp, color:GOLD,      bg:`${GOLD}1E`                },
];

const testimonials = [
  { name:"Mohammed Al-Rashid", role:"Property Owner",
    text:"Jar transformed how I manage my 12 properties. The maintenance tracking alone saved me countless hours.", rating:5 },
  { name:"Sarah Al-Mansour",   role:"Tenant",
    text:"I can submit maintenance requests and track their status in real-time. It's incredibly convenient.",     rating:5 },
  { name:"Ahmad Contractors",  role:"Contractor",
    text:"Getting job assignments and submitting quotes has never been easier. Highly recommended.",               rating:4 },
];
