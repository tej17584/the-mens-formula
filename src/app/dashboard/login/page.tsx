import { AdminLoginForm } from "@/components/dashboard/admin-login-form";
import { BrandLogo } from "@/components/brand-logo";
import { translate } from "@/i18n";

export default function DashboardLoginPage() {
  return (
    <main className="dashboard-login">
      <BrandLogo />
      <p className="eyebrow">{translate("dashboard.title")}</p>
      <h1>{translate("dashboard.loginTitle")}</h1>
      <AdminLoginForm />
    </main>
  );
}
