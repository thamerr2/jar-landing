import { Switch, Route, Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Plus, ClipboardList, Wallet, Bell, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import ResidentHome          from "./ResidentHome";
import ResidentNewRequest    from "./ResidentNewRequest";
import ResidentRequestDetail from "./ResidentRequestDetail";
import ResidentPayments      from "./ResidentPayments";
import ResidentNotifications from "./ResidentNotifications";

const GREEN = "#7FD4A0";
const TEAL  = "#0D9488";
const TEXT  = "#F8FAFC";
const MUTED = "#94A3B8";
const BG    = "#0D1F1A";

export default function ResidentLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();

  const TABS = [
    { href: "/resident",               icon: Home,          label: t("resident.home")         },
    { href: "/resident/new-request",   icon: Plus,          label: t("resident.newRequest")   },
    { href: "/resident/requests",      icon: ClipboardList, label: t("resident.myRequests")   },
    { href: "/resident/payments",      icon: Wallet,        label: t("resident.payments")     },
    { href: "/resident/notifications", icon: Bell,          label: t("resident.notifications") },
  ];

  const isActive = (href: string) =>
    href === "/resident" ? location === "/resident" : location.startsWith(href);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: BG }}>
      <header className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(127,212,160,0.1)", background: "rgba(13,31,26,0.95)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${GREEN}, ${TEAL})` }}>
            <Home size={13} style={{ color: BG }} />
          </div>
          <span className="font-bold text-sm" style={{ color: TEXT }}>جار</span>
          <span className="text-xs ms-1" style={{ color: MUTED }}>— {user?.name}</span>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          style={{ color: MUTED }}
        >
          <LogOut size={16} />
        </button>
      </header>

      <main className="flex-1 overflow-auto pb-20 md:pb-4">
        <div className="max-w-lg mx-auto px-4 py-5">
          <Switch>
            <Route path="/resident"                component={ResidentHome}          />
            <Route path="/resident/new-request"    component={ResidentNewRequest}    />
            <Route path="/resident/requests/:id"   component={ResidentRequestDetail} />
            <Route path="/resident/requests"       component={ResidentNotifications} />
            <Route path="/resident/payments"       component={ResidentPayments}      />
            <Route path="/resident/notifications"  component={ResidentNotifications} />
          </Switch>
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 border-t"
        style={{
          background: "rgba(8,15,13,0.97)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(127,212,160,0.1)"
        }}>
        <div className="flex items-stretch max-w-lg mx-auto">
          {TABS.map(tab => {
            const active = isActive(tab.href);
            return (
              <Link key={tab.href} href={tab.href} className="flex-1">
                <div className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors cursor-pointer"
                )} style={{ color: active ? GREEN : MUTED }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                  <span className="hidden sm:block text-xs">{tab.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
