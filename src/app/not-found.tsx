import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { translate } from "@/i18n";

export default function NotFound() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="shell not-found-page">
        <p className="eyebrow">{translate("notFound.eyebrow")}</p>
        <h1>{translate("notFound.title")}</h1>
        <p>{translate("notFound.description")}</p>
        <div className="not-found-actions">
          <Link className="button button-primary" href="/catalogo">
            {translate("notFound.catalog")}
          </Link>
          <Link className="button button-secondary" href="/">
            {translate("notFound.home")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
