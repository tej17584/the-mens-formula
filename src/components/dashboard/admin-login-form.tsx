"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, type AuthActionState } from "@/actions/auth";
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
    <form className="dashboard-login-form" action={action}>
      <label>
        <span>{t("dashboard.email")}</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>{t("dashboard.password")}</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="button button-primary"
        disabled={pending}
        type="submit"
      >
        {t("dashboard.signIn")}
      </button>
    </form>
  );
}
