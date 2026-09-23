"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  deleteProductAction,
  setProductVisibility,
} from "@/actions/dashboard-products";
import { useTranslations } from "@/i18n";

export function ProductActions({
  editHref,
  id,
  isActive,
}: {
  editHref: string;
  id: string;
  isActive: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  const setVisibility = () =>
    startTransition(async () => {
      const result = await setProductVisibility(id, !isActive);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  const remove = () =>
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.error) setError(result.error);
      else {
        dialog.current?.close();
        router.refresh();
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
      <button
        type="button"
        className="dashboard-action-button dashboard-action-visibility"
        disabled={pending}
        onClick={setVisibility}
      >
        {isActive ? t("dashboard.hideFromWeb") : t("dashboard.showOnWeb")}
      </button>
      <button
        type="button"
        className="dashboard-action-button dashboard-action-delete"
        disabled={pending}
        onClick={() => dialog.current?.showModal()}
      >
        {t("common.delete")}
      </button>
      {error ? <p role="alert">{error}</p> : null}
      <dialog className="confirm-dialog" ref={dialog}>
        <p>{t("dashboard.deleteConfirmation")}</p>
        <div>
          <button type="button" onClick={() => dialog.current?.close()}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="danger-button"
            disabled={pending}
            onClick={remove}
          >
            {t("dashboard.deleteProduct")}
          </button>
        </div>
      </dialog>
    </div>
  );
}
