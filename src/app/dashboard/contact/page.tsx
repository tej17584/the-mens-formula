import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardMessageCard } from "@/components/dashboard/dashboard-message-card";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getContactMessages } from "@/lib/dashboard";

export default async function DashboardContactPage({
  searchParams,
}: PageProps<"/dashboard/contact">) {
  await requireAdmin();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status =
    params.status === "new" || params.status === "read"
      ? params.status
      : undefined;
  const result = await getContactMessages(page, status);
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const filters = [
    {
      href: "/dashboard/contact",
      label: translate("dashboard.allStatuses"),
      active: !status,
    },
    {
      href: "/dashboard/contact?status=new",
      label: translate("dashboard.new"),
      active: status === "new",
    },
    {
      href: "/dashboard/contact?status=read",
      label: translate("dashboard.read"),
      active: status === "read",
    },
  ];
  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-heading-row">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.messages")}</h1>
          <p>{translate("dashboard.messagesSubtitle")}</p>
        </div>
      </header>
      <div className="dashboard-inbox-toolbar">
        <nav
          className="dashboard-status-links"
          aria-label={translate("dashboard.messageStatus")}
        >
          {filters.map((filter) => (
            <Link
              className={filter.active ? "is-active" : undefined}
              href={filter.href}
              key={filter.href}
            >
              {filter.label}
            </Link>
          ))}
        </nav>
        <p className="dashboard-result-count">
          {result.total} {translate("dashboard.messages").toLowerCase()}
        </p>
      </div>
      <div className="dashboard-messages" role="list">
        {result.messages.map((message) => (
          <DashboardMessageCard
            key={message.id}
            message={{
              id: message.id,
              name: message.name,
              contact: message.contact,
              message: message.message,
              status: message.status,
              created_at: message.created_at,
              product: message.product,
            }}
          />
        ))}
      </div>
      {result.messages.length === 0 ? (
        <p className="empty-state">{translate("dashboard.noMessages")}</p>
      ) : null}
      <nav className="pagination" aria-label={translate("catalog.page")}>
        <Link
          className={page <= 1 ? "disabled" : ""}
          href={`/dashboard/contact?page=${Math.max(1, page - 1)}${status ? `&status=${status}` : ""}`}
        >
          {translate("catalog.previous")}
        </Link>
        <span>
          {page} {translate("catalog.of")} {totalPages}
        </span>
        <Link
          className={page >= totalPages ? "disabled" : ""}
          href={`/dashboard/contact?page=${Math.min(totalPages, page + 1)}${status ? `&status=${status}` : ""}`}
        >
          {translate("catalog.next")}
        </Link>
      </nav>
    </DashboardLayout>
  );
}
