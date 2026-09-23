import { AdminLoginForm } from "@/components/dashboard/admin-login-form";
import { BrandLogo } from "@/components/brand-logo";
import { translate } from "@/i18n";

type PageProps = {
  searchParams: Promise<{ reason?: string | string[] }>;
};

export default async function DashboardLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionExpired = params.reason === "expired";

  return (
    <main className="dashboard-login">
      <BrandLogo />
      <p className="eyebrow">{translate("dashboard.title")}</p>
      <h1>{translate("dashboard.loginTitle")}</h1>
      {sessionExpired ? (
        <p className="form-error" role="status">
          {translate("dashboard.sessionExpired")}
        </p>
      ) : null}
      <AdminLoginForm />
    </main>
  );
}
