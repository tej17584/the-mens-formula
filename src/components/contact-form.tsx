"use client";

import { useActionState } from "react";
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

export function ContactForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(createContactMessage, {});

  return (
    <Card className="contact-form-card storefront-contact-form">
      <CardHeader>
        <CardTitle>{t("contact.formTitle")}</CardTitle>
        <CardDescription>{t("contact.formDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="contact-form" action={formAction}>
          <div className="flex flex-col gap-2">
            <Label className="storefront-label" htmlFor="contact-name">
              {t("contact.name")}
            </Label>
            <Input
              className="storefront-input"
              id="contact-name"
              required
              name="name"
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="storefront-label" htmlFor="contact-channel">
              {t("contact.contact")}
            </Label>
            <Input
              className="storefront-input"
              id="contact-channel"
              required
              name="contact"
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="storefront-label" htmlFor="contact-message">
              {t("contact.message")}
            </Label>
            <Textarea
              className="storefront-textarea"
              id="contact-message"
              required
              name="message"
              rows={6}
              placeholder={t("contact.placeholder")}
            />
          </div>
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
