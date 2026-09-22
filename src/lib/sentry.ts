import * as Sentry from "@sentry/nextjs";

/** Reports an operational error with a searchable, scoped Sentry context. */
export function sentryErrorReport(error: unknown, context: string): void {
  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : (() => {
            try {
              return JSON.stringify(error);
            } catch {
              return String(error);
            }
          })();

  Sentry.captureException(
    error instanceof Error ? error : new Error(`[${context}] ${message}`),
    { tags: { context } },
  );
}
