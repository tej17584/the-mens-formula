import { BrandLogo } from "@/components/brand-logo";
import { SiteHeaderNav } from "@/components/site-header-nav";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell storefront-shell header-inner">
        <BrandLogo />
        <SiteHeaderNav />
      </div>
    </header>
  );
}
