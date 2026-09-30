import Link from "next/link";
import { MailIcon, MessageCircleIcon, Share2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { translate } from "@/i18n";
import { siteConfig } from "@/lib/site-config";

function whatsappHref(number: string) {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function ContactAside() {
  const { email, whatsapp, instagram } = siteConfig.contact;
  const wa = whatsapp ? whatsappHref(whatsapp) : null;

  return (
    <aside
      className="contact-aside storefront-contact-aside"
      aria-label={translate("contact.channelsTitle")}
    >
      <Card className="contact-aside-card storefront-contact-aside-card">
        <CardHeader>
          <CardTitle>{translate("contact.channelsTitle")}</CardTitle>
          <CardDescription>{translate("contact.responseNote")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {email ? (
            <a className="contact-channel" href={`mailto:${email}`}>
              <span className="contact-channel-icon" aria-hidden="true">
                <MailIcon />
              </span>
              <span className="contact-channel-copy">
                <strong>{translate("contact.emailLabel")}</strong>
                <span>{email}</span>
              </span>
            </a>
          ) : null}
          {wa ? (
            <a
              className="contact-channel"
              href={wa}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="contact-channel-icon" aria-hidden="true">
                <MessageCircleIcon />
              </span>
              <span className="contact-channel-copy">
                <strong>{translate("contact.whatsappLabel")}</strong>
                <span>{whatsapp}</span>
              </span>
            </a>
          ) : null}
          {instagram ? (
            <a
              className="contact-channel"
              href={instagram}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="contact-channel-icon" aria-hidden="true">
                <Share2Icon />
              </span>
              <span className="contact-channel-copy">
                <strong>{translate("contact.instagramLabel")}</strong>
                <span>{translate("contact.instagramCta")}</span>
              </span>
            </a>
          ) : null}
          {!email && !wa && !instagram ? (
            <p className="contact-channel-fallback">{translate("contact.description")}</p>
          ) : null}
        </CardContent>
      </Card>
      <Card className="contact-aside-card contact-aside-tip" size="sm">
        <CardContent>
          <p>{translate("contact.tip")}</p>
          <Link className="contact-aside-link" href="/catalogo">
            {translate("footer.exploreCatalog")}
            <span aria-hidden="true"> →</span>
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
