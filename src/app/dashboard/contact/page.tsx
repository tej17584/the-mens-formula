import Link from "next/link";
import { markContactReadAction } from "@/actions/dashboard-contact";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
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
  return (
    <DashboardLayout>
      <header className="dashboard-heading dashboard-heading-row">
        <div>
          <p className="eyebrow">{translate("dashboard.title")}</p>
          <h1>{translate("dashboard.messages")}</h1>
        </div>
        <nav className="dashboard-status-links">
          <Link href="/dashboard/contact">
            {translate("dashboard.allStatuses")}
          </Link>
          <Link href="/dashboard/contact?status=new">
            {translate("dashboard.new")}
          </Link>
          <Link href="/dashboard/contact?status=read">
            {translate("dashboard.read")}
          </Link>
        </nav>
      </header>
      <div className="dashboard-messages">
        {result.messages.map((message) => (
          <article key={message.id} className="dashboard-message">
            <header>
              <div>
                <strong>{message.name}</strong>
                <a href={`mailto:${message.contact}`}>{message.contact}</a>
              </div>
              <span
                className={`status-pill ${message.status === "new" ? "active" : ""}`}
              >
                {message.status === "new"
                  ? translate("dashboard.new")
                  : translate("dashboard.read")}
              </span>
            </header>
            <p>{message.message}</p>
            {message.product ? (
              <Link
                className="text-link"
                href={`/catalogo/${message.product.slug}`}
              >
                {message.product.name}
              </Link>
            ) : null}
            <footer>
              <time dateTime={message.created_at}>
                {new Intl.DateTimeFormat("es-GT", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(message.created_at))}
              </time>
              {message.status === "new" ? (
                <form action={markContactReadAction.bind(null, message.id)}>
                  <button type="submit">
                    {translate("dashboard.markRead")}
                  </button>
                </form>
              ) : null}
            </footer>
          </article>
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
