import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

export function DashboardBackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link className="dashboard-back-link" href={href}>
      <ChevronLeftIcon aria-hidden className="size-4" />
      {label}
    </Link>
  );
}
