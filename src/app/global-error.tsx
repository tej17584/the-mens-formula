"use client";

import { useEffect } from "react";
import { useTranslations } from "@/i18n";
import { sentryErrorReport } from "@/lib/sentry";

export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  const t = useTranslations();

  useEffect(() => {
    sentryErrorReport(error, "APP - GLOBAL_ERROR");
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main>
          <h1>{t("common.unexpectedError")}</h1>
          <button type="button" onClick={reset}>
            {t("common.retry")}
          </button>
        </main>
      </body>
    </html>
  );
}
