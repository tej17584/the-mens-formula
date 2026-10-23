"use client";

import {
  createContext,
  useCallback,
  useContext,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { RouteLoadingRegion } from "@/components/ui/route-loading-overlay";
import { useTranslations } from "@/i18n";

type NavigationLoadingContextValue = {
  isPending: boolean;
  navigate: (href: string) => void;
};

const NavigationLoadingContext =
  createContext<NavigationLoadingContextValue | null>(null);

export function NavigationLoadingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [router],
  );

  return (
    <NavigationLoadingContext.Provider value={{ isPending, navigate }}>
      {children}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error(
      "useNavigationLoading must be used within NavigationLoadingProvider",
    );
  }
  return context;
}

export function NavigationLoadingRegion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations();
  const { isPending } = useNavigationLoading();
  return (
    <RouteLoadingRegion
      pending={isPending}
      label={t("common.loading")}
      className={className}
    >
      {children}
    </RouteLoadingRegion>
  );
}
