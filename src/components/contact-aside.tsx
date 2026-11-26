import Link from "next/link";
import { SocialNetworkIcon, WhatsAppIcon } from "@/components/social-icons";
import { translate } from "@/i18n";
import type { SiteSettings } from "@/lib/catalog";
import {
  formatWhatsappNumber,
  socialLinksFromSettings,
  whatsappHref,
} from "@/lib/site-links";

export function ContactAside({ settings }: { settings: SiteSettings }) {
  const wa = settings.whatsappNumber
    ? whatsappHref(settings.whatsappNumber)
    : null;
  const socials = socialLinksFromSettings(settings);
  const displayNumber = settings.whatsappNumber
    ? formatWhatsappNumber(settings.whatsappNumber)
    : "";

  return (
    <section
      className="contact-direct"
      aria-label={translate("contact.channelsTitle")}
    >
      {wa ? (
        <a
          className="contact-whatsapp-card"
          href={wa}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="contact-whatsapp-icon" aria-hidden="true">
            <WhatsAppIcon />
          </span>
          <span className="contact-whatsapp-copy">
            <strong>{translate("contact.whatsappLabel")}</strong>
            <span className="contact-whatsapp-number">{displayNumber}</span>
            <span className="contact-whatsapp-cta">
              {translate("contact.whatsappCta")}
            </span>
          </span>
        </a>
      ) : (
        <p className="contact-channel-fallback">
          {translate("contact.description")}
        </p>
      )}

      {socials.length ? (
        <div className="contact-socials">
          <p className="contact-socials-title">
            {translate("contact.socialsTitle")}
          </p>
          <ul className="contact-socials-list">
            {socials.map((social) => (
              <li key={social.network}>
                <a
                  className={`contact-social-link contact-social-link-${social.network}`}
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-label={social.label}
                >
                  <SocialNetworkIcon network={social.network} />
                  <span>{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link className="contact-aside-link" href="/catalogo">
        {translate("footer.exploreCatalog")}
        <span aria-hidden="true"> →</span>
      </Link>
    </section>
  );
}
