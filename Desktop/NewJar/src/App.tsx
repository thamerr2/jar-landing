import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth, type User } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

const HoaPortal      = lazy(() => import("@/pages/hoa/HoaLayout"));
const ResidentPortal = lazy(() => import("@/pages/resident/ResidentLayout"));
const ProviderPortal = lazy(() => import("@/pages/provider/ProviderLayout"));
const OwnerPortal    = lazy(() => import("@/pages/owner/OwnerLayout"));

function roleHome(user: User): string {
  switch (user.role) {
    case "union_admin":
    case "super_admin": return "/hoa";
    case "tenant":      return "/resident";
    case "contractor":  return "/provider";
    case "owner":       return "/owner";
    default:            return "/";
  }
}

const PORTAL_ROLES: Record<string, User["role"][]> = {
  hoa:      ["union_admin", "super_admin"],
  resident: ["tenant"],
  provider: ["contractor"],
  owner:    ["owner"],
};

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PortalGuard({
  portal,
  children
}: {
  portal: keyof typeof PORTAL_ROLES;
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/" />;
  if (user && !PORTAL_ROLES[portal].includes(user.role)) {
    return <Redirect to={roleHome(user)} />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      {children}
    </Suspense>
  );
}

function DirectionSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.dir  = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return null;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated && user ? <Redirect to={roleHome(user)} /> : <Landing />}
      </Route>

      <Route path="/hoa/:rest*">
        <PortalGuard portal="hoa"><HoaPortal /></PortalGuard>
      </Route>

      <Route path="/resident/:rest*">
        <PortalGuard portal="resident"><ResidentPortal /></PortalGuard>
      </Route>

      <Route path="/provider/:rest*">
        <PortalGuard portal="provider"><ProviderPortal /></PortalGuard>
      </Route>

      <Route path="/owner/:rest*">
        <PortalGuard portal="owner"><OwnerPortal /></PortalGuard>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DirectionSync />
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
