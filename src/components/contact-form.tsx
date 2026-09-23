"use client";

import { useActionState } from "react";
import { createContactMessage } from "@/actions/contact";
import { useTranslations } from "@/i18n";

export function ContactForm() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState(createContactMessage, {});

  return (
    <form className="contact-form" action={formAction}>
      <label>
        {t("contact.name")}
        <input required name="name" autoComplete="name" />
      </label>
      <label>
        {t("contact.contact")}
        <input required name="contact" autoComplete="email" />
      </label>
      <label>
        {t("contact.message")}
        <textarea
          required
          name="message"
          rows={4}
          placeholder={t("contact.placeholder")}
        />
      </label>
      <button
        className="button button-primary"
        disabled={pending}
        type="submit"
      >
        {t("contact.submit")}
      </button>
      {state.success ? (
        <p className="form-success" role="status">
          {t("contact.success")}
        </p>
      ) : null}
      {state.error ? <p className="form-error">{state.error}</p> : null}
    </form>
  );
}
