import { useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Wrench, Sparkles, Megaphone, Wallet,
  LogOut, Menu, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import HoaDashboard     from "./HoaDashboard";
import HoaRequests      from "./HoaRequests";
import HoaDispatch      from "./HoaDispatch";
import HoaAnnouncements from "./HoaAnnouncements";
import HoaFinancials    from "./HoaFinancials";

const SIDEBAR = "#080F0D";
const GREEN   = "#7FD4A0";
const TEAL    = "#0D9488";
const TEXT    = "#F8FAFC";
const MUTED   = "#94A3B8";
const BG      = "#0D1F1A";

export default function HoaLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV = [
    { key: "dashboard",     href: "/hoa",               icon: LayoutDashboard, label: t("hoa.dashboard")     },
    { key: "requests",      href: "/hoa/requests",       icon: Wrench,          label: t("hoa.requests")      },
    { key: "dispatch",      href: "/hoa/dispatch",       icon: Sparkles,        label: t("hoa.dispatch")      },
    { key: "announcements", href: "/hoa/announcements",  icon: Megaphone,       label: t("hoa.announcements") },
    { key: "financials",    href: "/hoa/financials",     icon: Wallet,          label: t("hoa.financials")    },
  ];

  const isActive = (href: string) =>
    href === "/hoa" ? location === "/hoa" : location.startsWith(href);

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 flex items-center gap-2.5 border-b"
        style={{ borderColor: "rgba(127,212,160,0.1)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})` }}>
          <Building2 size={15} style={{ color: BG }} />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm leading-tight" style={{ color: TEXT }}>جار</div>
          <div className="text-xs truncate" style={{ color: MUTED }}>{t("auth.roles.union_admin")}</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV.map(item => (
          <Link key={item.key} href={item.href}>
            <div
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors",
                isActive(item.href) ? "font-semibold" : "hover:bg-white/5"
              )}
              style={{
                background: isActive(item.href) ? "rgba(127,212,160,0.12)" : undefined,
                color: isActive(item.href) ? GREEN : MUTED,
              }}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="px-2 pb-4 border-t pt-3" style={{ borderColor: "rgba(127,212,160,0.1)" }}>
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "rgba(127,212,160,0.15)", color: GREEN }}>
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: TEXT }}>{user?.name}</div>
            <div className="text-xs truncate" style={{ color: MUTED }}>{user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors"
          style={{ color: MUTED }}
        >
          <LogOut size={15} />
          {t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-e"
        style={{ background: SIDEBAR, borderColor: "rgba(127,212,160,0.1)" }}>
        <SidebarInner />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 flex flex-col border-e"
            style={{ background: SIDEBAR, borderColor: "rgba(127,212,160,0.1)" }}>
            <SidebarInner />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "rgba(127,212,160,0.1)" }}>
          <button onClick={() => setMobileOpen(true)} style={{ color: TEXT }}>
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm" style={{ color: TEXT }}>
            {NAV.find(n => isActive(n.href))?.label ?? "HOA"}
          </span>
        </div>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Switch>
            <Route path="/hoa"               component={HoaDashboard}     />
            <Route path="/hoa/requests"      component={HoaRequests}      />
            <Route path="/hoa/dispatch"      component={HoaDispatch}      />
            <Route path="/hoa/announcements" component={HoaAnnouncements} />
            <Route path="/hoa/financials"    component={HoaFinancials}    />
          </Switch>
        </main>
      </div>
    </div>
  );
}
