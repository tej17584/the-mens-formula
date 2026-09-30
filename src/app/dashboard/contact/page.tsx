import Link from "next/link";
import { InboxIcon } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardMessageCard } from "@/components/dashboard/dashboard-message-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { translate } from "@/i18n";
import { requireAdmin } from "@/lib/admin-auth";
import { getContactMessages } from "@/lib/dashboard";

function contactHref(page: number, status?: string) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page > 1) params.set("page", String(page));
  return `/dashboard/contact${params.size ? `?${params}` : ""}`;
}

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
        <Empty className="dashboard-empty">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>{translate("dashboard.noMessages")}</EmptyTitle>
            <EmptyDescription>
              {translate("dashboard.messagesSubtitle")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      <Pagination aria-label={translate("catalog.page")}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={page <= 1}
              aria-label={translate("catalog.previous")}
              className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
              href={contactHref(Math.max(1, page - 1), status)}
              text={translate("catalog.previous")}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={contactHref(page, status)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-sm text-muted-foreground">
              {translate("catalog.of")} {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              aria-disabled={page >= totalPages}
              aria-label={translate("catalog.next")}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : undefined
              }
              href={contactHref(Math.min(totalPages, page + 1), status)}
              text={translate("catalog.next")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DashboardLayout>
  );
}
