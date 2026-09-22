import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardSettingsForm } from "@/components/dashboard/dashboard-settings-form";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardSiteSettings } from "@/lib/dashboard";

export default async function DashboardSettingsPage() {
  await requireAdmin();
  const settings = await getDashboardSiteSettings();
  return (
    <DashboardLayout>
      <header className="dashboard-heading">
        <p className="eyebrow">{translate("dashboard.title")}</p>
        <h1>{translate("dashboard.settings")}</h1>
      </header>
      <DashboardSettingsForm
        whatsappNumber={settings?.whatsapp_number ?? null}
        whatsappProductMessage={settings?.whatsapp_product_message ?? ""}
      />
    </DashboardLayout>
  );
}
