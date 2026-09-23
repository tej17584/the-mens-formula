import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardNav />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
