import { useTranslation } from "react-i18next";
import { Link } from "wouter";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">{t("common.error")}</p>
      <Link href="/" className="text-primary underline">{t("common.back")}</Link>
    </div>
  );
}
