import { useEffect, useRef } from "react";

const BG     = "#2A2F40";
const PCOLS  = [
  "#BC7D37", // bronze
  "#EED6AC", // sand
  "#D4A055", // light bronze
  "#F0EAD8", // cream
  "#8B6A3A", // dark bronze
  "#C4A882", // medium sand
  "#FEF7DC", // warm cream
];

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
    vx:          Math.cos(a + Math.PI / 2) * (0.25 + Math.random() * 0.6) * (Math.random() > 0.5 ? 1 : -1),
    vy:          -(0.4 + Math.random() * 0.8),
    size:        0.7 + Math.random() * 2.4,
    color:       PCOLS[Math.floor(Math.random() * PCOLS.length)],
    opacity:     (0.15 + Math.random() * 0.45) * 0.6,
    baseOpacity: 0.15 + Math.random() * 0.45,
    isDash:      Math.random() > 0.42,
    dashAngle:   Math.random() * Math.PI * 2,
    dashLen:     4 + Math.random() * 12,
    driftSpeed:  0.3 + Math.random() * 0.7,
    driftPhase:  Math.random() * Math.PI * 2,
    driftAmp:    0.4 + Math.random() * 0.8,
  };
}

export function AntiGravityCanvas({ parallaxOffset = 0 }: { parallaxOffset?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(parallaxOffset);
  offsetRef.current = parallaxOffset;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick = 0;
    let particles: Particle[] = Array.from({ length: 50 }, () => mkP(canvas.width, canvas.height));
    let raf: number;

    const draw = () => {
      tick++;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
      grad.addColorStop(0,    "rgba(42,47,64,0)");
      grad.addColorStop(0.58, "rgba(42,47,64,0)");
      grad.addColorStop(1,    "rgba(30,34,50,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      for (const p of particles) {
        const wave = Math.sin(tick * 0.008 * p.driftSpeed + p.driftPhase) * p.driftAmp;
        p.x += p.vx + wave * 0.3;
        p.y += p.vy;
        p.opacity = Math.min(p.baseOpacity, p.opacity + 0.025);

        if (p.x < -20)    p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20)    { p.y = H + 20; p.x = Math.random() * W; }
        if (p.y > H + 20) p.y = -20;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = p.color;

        if (p.isDash) {
          ctx.save();
          ctx.translate(p.x, p.y + offsetRef.current * 0.3);
          ctx.rotate(p.dashAngle + tick * 0.004);
          ctx.beginPath();
          ctx.roundRect(-p.dashLen / 2, -p.size / 2, p.dashLen, p.size, p.size / 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y + offsetRef.current * 0.3, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: BG }}
    />
  );
}
