"use client";

import { useActionState, useEffect, useRef } from "react";
import { createContactMessage } from "@/actions/contact";
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

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const t = useTranslations();
  const startedAtInput = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [state, formAction, pending] = useActionState(createContactMessage, {});

  useEffect(() => {
    if (startedAtInput.current && !startedAtInput.current.value) {
      startedAtInput.current.value = String(Date.now());
    }
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) return;
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-contact-turnstile]",
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.dataset.contactTurnstile = "true";
    document.head.appendChild(script);
  }, []);

  return (
    <Card className="contact-form-card storefront-contact-form">
      <CardHeader>
        <CardTitle>{t("contact.formTitle")}</CardTitle>
        <CardDescription>{t("contact.formDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="contact-form" action={formAction}>
          <input
            className="contact-honeypot"
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <input
            className="contact-honeypot"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <input ref={startedAtInput} type="hidden" name="formStartedAt" />
          <div className="flex flex-col gap-2.5">
            <Label className="storefront-label" htmlFor="contact-name">
              {t("contact.name")}
            </Label>
            <Input
              className="storefront-input text-base md:text-base"
              id="contact-name"
              required
              name="name"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label className="storefront-label" htmlFor="contact-channel">
              {t("contact.contact")}
            </Label>
            <Input
              className="storefront-input text-base md:text-base"
              id="contact-channel"
              required
              name="contact"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label className="storefront-label" htmlFor="contact-message">
              {t("contact.message")}
            </Label>
            <Textarea
              className="storefront-textarea text-base md:text-base"
              id="contact-message"
              required
              name="message"
              rows={6}
              placeholder={t("contact.placeholder")}
            />
          </div>
          {turnstileSiteKey ? (
            <div
              ref={turnstileRef}
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
            />
          ) : null}
          <Button className="storefront-submit" disabled={pending} size="lg" type="submit">
            {t("contact.submit")}
          </Button>
          {state.success ? (
            <Alert>
              <AlertDescription role="status">
                {t("contact.success")}
              </AlertDescription>
            </Alert>
          ) : null}
          {state.error ? (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}