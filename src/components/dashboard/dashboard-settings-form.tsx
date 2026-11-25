"use client";

import { useActionState, useEffect, useRef } from "react";
import { notify } from "@/lib/notify";
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
  instagramUrl,
  facebookUrl,
  tiktokUrl,
}: {
  whatsappNumber: string | null;
  whatsappProductMessage: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
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
    notify.success(t("dashboard.settingsSaved"), {
      id: "dashboard-settings-saved",
    });
  }, [state.success, t]);
  return (
    <Card className="dashboard-settings-card dashboard-readable">
      <CardHeader>
        <CardTitle>{t("dashboard.settings")}</CardTitle>
        <CardDescription>{t("dashboard.settingsSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="dashboard-settings-form" action={action}>
          <div className="dashboard-settings-field">
            <Label htmlFor="whatsappNumber">
              {t("dashboard.whatsappNumber")}
            </Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              inputMode="tel"
              required
              defaultValue={whatsappNumber ?? ""}
            />
            <p className="dashboard-field-help">
              {t("dashboard.whatsappHelp")}
            </p>
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
          <div className="dashboard-settings-socials">
            <p className="dashboard-settings-socials-title">
              {t("dashboard.socialsSection")}
            </p>
            <p className="dashboard-field-help">{t("dashboard.socialsHelp")}</p>
            <div className="dashboard-settings-field">
              <Label htmlFor="instagramUrl">
                {t("dashboard.instagramUrl")}
              </Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                inputMode="url"
                defaultValue={instagramUrl ?? ""}
                placeholder="https://www.instagram.com/themensformulagt"
              />
            </div>
            <div className="dashboard-settings-field">
              <Label htmlFor="facebookUrl">{t("dashboard.facebookUrl")}</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                inputMode="url"
                defaultValue={facebookUrl ?? ""}
                placeholder="https://www.facebook.com/"
              />
            </div>
            <div className="dashboard-settings-field">
              <Label htmlFor="tiktokUrl">{t("dashboard.tiktokUrl")}</Label>
              <Input
                id="tiktokUrl"
                name="tiktokUrl"
                type="url"
                inputMode="url"
                defaultValue={tiktokUrl ?? ""}
                placeholder="https://www.tiktok.com/@themensformula"
              />
            </div>
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
