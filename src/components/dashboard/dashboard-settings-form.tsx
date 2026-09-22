"use client";

import { useActionState } from "react";
import {
  updateSiteSettings,
  type SettingsActionState,
} from "@/actions/dashboard-settings";
import { useTranslations } from "@/i18n";

const initialState: SettingsActionState = {};

export function DashboardSettingsForm({
  whatsappNumber,
  whatsappProductMessage,
}: {
  whatsappNumber: string | null;
  whatsappProductMessage: string;
}) {
  const t = useTranslations();
  const [state, action, pending] = useActionState(
    updateSiteSettings,
    initialState,
  );
  return (
    <form className="dashboard-product-form" action={action}>
      <label>
        <span>{t("dashboard.whatsappNumber")}</span>
        <input
          name="whatsappNumber"
          inputMode="tel"
          required
          defaultValue={whatsappNumber ?? ""}
        />
        <small>{t("dashboard.whatsappHelp")}</small>
      </label>
      <label>
        <span>{t("dashboard.whatsappMessage")}</span>
        <textarea
          name="whatsappProductMessage"
          rows={5}
          required
          defaultValue={whatsappProductMessage}
        />
      </label>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="form-success" role="status">
          {t("dashboard.settingsSaved")}
        </p>
      ) : null}
      <button
        className="button button-primary"
        disabled={pending}
        type="submit"
      >
        {t("dashboard.saveSettings")}
      </button>
    </form>
  );
}
