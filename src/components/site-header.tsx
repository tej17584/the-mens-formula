import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { translate } from "@/i18n";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <BrandLogo />
        <nav className="header-nav" aria-label="Navegación principal">
          <Link href="/">{translate("header.home")}</Link>
          <Link href="/catalogo">{translate("header.catalog")}</Link>
          <Link href="/contacto">{translate("header.contact")}</Link>
        </nav>
      </div>
    </header>
  );
}
