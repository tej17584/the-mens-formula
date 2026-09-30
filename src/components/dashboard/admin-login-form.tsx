"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, type AuthActionState } from "@/actions/auth";
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
import { useTranslations } from "@/i18n";

const initialState: AuthActionState = {};

export function AdminLoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [state, action, pending] = useActionState(signIn, initialState);
  useEffect(() => {
    if (state.success) router.replace("/dashboard");
  }, [router, state.success]);
  return (
    <Card className="dashboard-login-card">
      <CardHeader>
        <CardTitle>{t("dashboard.loginTitle")}</CardTitle>
        <CardDescription>{t("dashboard.overview")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="dashboard-login-form" action={action}>
          <div className="dashboard-login-field">
            <Label htmlFor="admin-email">{t("dashboard.email")}</Label>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="dashboard-login-field">
            <Label htmlFor="admin-password">{t("dashboard.password")}</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state.error ? (
            <Alert variant="destructive">
              <AlertDescription role="alert">{state.error}</AlertDescription>
            </Alert>
          ) : null}
          <Button className="w-full" disabled={pending} type="submit">
            {t("dashboard.signIn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
