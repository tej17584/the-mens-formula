import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageLoadingState } from "@/components/ui/route-loading-overlay";
import { translate } from "@/i18n";

export default function CatalogLoading() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="catalog-page storefront-catalog">
        <div className="catalog-hero-band">
          <div className="shell storefront-shell">
            <header className="catalog-page-header">
              <h1>{translate("catalog.title")}</h1>
            </header>
          </div>
        </div>
        <div className="shell storefront-shell catalog-page-body">
          <PageLoadingState label={translate("common.loading")} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
