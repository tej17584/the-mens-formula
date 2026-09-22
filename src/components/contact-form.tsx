"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `Hola, soy ${form.get("name")}. ${form.get("message")}`;
    if (siteConfig.contact.whatsapp)
      window.open(
        `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    else if (siteConfig.contact.email)
      window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("Consulta desde el catálogo")}&body=${encodeURIComponent(message)}`;
    setSent(true);
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Nombre
        <input required name="name" autoComplete="name" />
      </label>
      <label>
        Correo o teléfono
        <input required name="contact" autoComplete="email" />
      </label>
      <label>
        ¿Qué producto buscas?
        <textarea
          required
          name="message"
          rows={4}
          placeholder="Cuéntanos qué necesitas para tu barbería."
        />
      </label>
      <button className="button button-primary" type="submit">
        Enviar consulta
      </button>
      {sent ? (
        <p className="form-success" role="status">
          Abrimos tu canal de contacto.
        </p>
      ) : null}
    </form>
  );
}
