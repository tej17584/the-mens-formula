"use client";

import { useActionState } from "react";
import { createContactMessage } from "@/actions/contact";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/i18n";

export function ContactForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(createContactMessage, {});

  return (
    <Card className="contact-form-card">
      <CardContent className="pt-6">
        <form className="contact-form" action={formAction}>
          <div className="contact-form-field">
            <Label htmlFor="contact-name">{t("contact.name")}</Label>
            <Input
              id="contact-name"
              required
              name="name"
              autoComplete="name"
            />
          </div>
          <div className="contact-form-field">
            <Label htmlFor="contact-channel">{t("contact.contact")}</Label>
            <Input
              id="contact-channel"
              required
              name="contact"
              autoComplete="email"
            />
          </div>
          <div className="contact-form-field">
            <Label htmlFor="contact-message">{t("contact.message")}</Label>
            <Textarea
              id="contact-message"
              required
              name="message"
              rows={4}
              placeholder={t("contact.placeholder")}
            />
          </div>
          <Button disabled={pending} type="submit">
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
