"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProductAction,
  setProductAvailability,
  setProductVisibility,
} from "@/actions/dashboard-products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/i18n";

export function ProductActions({
  editHref,
  id,
  isActive,
  isAvailable,
  inventoryListPath,
  productHref,
}: {
  editHref: string;
  id: string;
  isActive: boolean;
  isAvailable: boolean;
  inventoryListPath: string;
  productHref: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const afterChange = () => {
    router.replace(inventoryListPath, { scroll: false });
    router.refresh();
  };

  const setVisibility = () =>
    startTransition(async () => {
      const result = await setProductVisibility(id, !isActive);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t("dashboard.flashVisibilityUpdated"));
        afterChange();
      }
    });

  const setAvailability = () =>
    startTransition(async () => {
      const result = await setProductAvailability(id, !isAvailable);
      if (result.error) toast.error(result.error);
      else {
        toast.success(t("dashboard.flashAvailabilityUpdated"));
        afterChange();
      }
    });

  const remove = () =>
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.error) toast.error(result.error);
      else {
        setConfirmOpen(false);
        toast.success(t("dashboard.flashProductDeleted"));
        afterChange();
      }
    });

  return (
    <div className="dashboard-row-actions">
      <Link
        className="dashboard-action-button dashboard-action-edit"
        href={editHref}
      >
        {t("common.edit")}
      </Link>
      <DropdownMenu modal>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="dashboard-more-trigger"
              aria-label={t("dashboard.moreActions")}
            >
              <MoreHorizontal />
            </Button>
          }
        />
        <DropdownMenuContent align="end" side="bottom" className="min-w-56">
          <DropdownMenuItem
            onClick={() => window.open(productHref, "_blank", "noopener")}
          >
            {t("dashboard.viewProduct")}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={pending} onClick={setVisibility}>
            {isActive ? t("dashboard.hideFromWeb") : t("dashboard.showOnWeb")}
          </DropdownMenuItem>
          <DropdownMenuItem disabled={pending} onClick={setAvailability}>
            {isAvailable
              ? t("dashboard.markUnavailable")
              : t("dashboard.markAvailable")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={pending}
            onClick={() => setConfirmOpen(true)}
          >
            {t("dashboard.deleteProduct")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboard.deleteProduct")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.deleteConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={remove}
            >
              {t("dashboard.deleteProduct")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
