import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { NavigationLoadingProvider } from "@/components/dashboard/navigation-loading";
import { NotificationViewport } from "@/components/ui/notifications";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <NavigationLoadingProvider>
    <div className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardNav />
        <main className="dashboard-main">{children}</main>
      </div>
      <NotificationViewport />
    </div>
    </NavigationLoadingProvider>
  );
}
