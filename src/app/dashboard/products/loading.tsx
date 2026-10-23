import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PageLoadingState } from "@/components/ui/route-loading-overlay";
import { translate } from "@/i18n";

export default function DashboardProductsLoading() {
  return (
    <DashboardLayout>
      <header className="dashboard-heading">
        <p className="eyebrow">{translate("dashboard.title")}</p>
        <h1>{translate("dashboard.products")}</h1>
      </header>
      <PageLoadingState label={translate("common.loading")} />
    </DashboardLayout>
  );
}
