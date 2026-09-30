"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  updateSiteSettings,
  type SettingsActionState,
} from "@/actions/dashboard-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const notified = useRef(false);
  const [state, action, pending] = useActionState(
    updateSiteSettings,
    initialState,
  );
  useEffect(() => {
    if (!state.success) {
      notified.current = false;
      return;
    }
    if (notified.current) return;
    notified.current = true;
    toast.success(t("dashboard.settingsSaved"));
  }, [state.success, t]);
  return (
    <Card className="dashboard-settings-card">
      <CardHeader>
        <CardTitle>{t("dashboard.settings")}</CardTitle>
        <CardDescription>{t("dashboard.settingsSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="dashboard-settings-form" action={action}>
          <div className="dashboard-settings-field">
            <Label htmlFor="whatsappNumber">{t("dashboard.whatsappNumber")}</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              inputMode="tel"
              required
              defaultValue={whatsappNumber ?? ""}
            />
            <p className="dashboard-field-help">{t("dashboard.whatsappHelp")}</p>
          </div>
          <div className="dashboard-settings-field">
            <Label htmlFor="whatsappProductMessage">
              {t("dashboard.whatsappMessage")}
            </Label>
            <Textarea
              id="whatsappProductMessage"
              name="whatsappProductMessage"
              rows={5}
              required
              defaultValue={whatsappProductMessage}
            />
          </div>
          {state.error ? (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          <Button disabled={pending} type="submit">
            {t("dashboard.saveSettings")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
