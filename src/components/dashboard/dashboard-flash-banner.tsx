"use client";

import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n";
import { buildDashboardProductsPath } from "@/lib/dashboard/products-list-query";

function flashMessage(
  status: string | null,
  t: ReturnType<typeof useTranslations>,
) {
  switch (status) {
    case "created":
      return t("dashboard.flashProductCreated");
    case "updated":
      return t("dashboard.flashProductUpdated");
    case "deleted":
      return t("dashboard.flashProductDeleted");
    case "visibility":
      return t("dashboard.flashVisibilityUpdated");
    case "availability":
      return t("dashboard.flashAvailabilityUpdated");
    default:
      return null;
  }
}

export function DashboardFlashBanner() {
  const t = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status");
  const message = flashMessage(status, t);

  const dismiss = useCallback(() => {
    router.replace(
      buildDashboardProductsPath("/dashboard/products", params, { status: "" }),
      { scroll: false },
    );
  }, [params, router]);

  useEffect(() => {
    if (!status || !message) return;
    const timer = window.setTimeout(dismiss, 4000);
    return () => window.clearTimeout(timer);
  }, [status, message, dismiss]);

  if (!message) return null;

  return (
    <Alert className="dashboard-flash-banner">
      <AlertTitle>{t("dashboard.flashTitle")}</AlertTitle>
      <AlertDescription className="dashboard-flash-banner-body">
        <span>{message}</span>
        <Button type="button" variant="ghost" size="sm" onClick={dismiss}>
          {t("common.close")}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
