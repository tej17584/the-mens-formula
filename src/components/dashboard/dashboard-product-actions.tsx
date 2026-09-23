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
  productHref,
}: {
  editHref: string;
  id: string;
  isActive: boolean;
  productHref: string;
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
      <details className="dashboard-product-menu">
        <summary aria-label={t("dashboard.moreActions")}>
          <span aria-hidden="true">•••</span>
        </summary>
        <div role="menu">
          <Link
            href={productHref}
            rel="noreferrer"
            role="menuitem"
            target="_blank"
          >
            {t("dashboard.viewProduct")}
          </Link>
          <button
            type="button"
            disabled={pending}
            role="menuitem"
            onClick={setVisibility}
          >
            {isActive ? t("dashboard.hideFromWeb") : t("dashboard.showOnWeb")}
          </button>
          <span aria-hidden="true" className="dashboard-menu-divider" />
          <button
            type="button"
            className="dashboard-menu-danger"
            disabled={pending}
            role="menuitem"
            onClick={() => dialog.current?.showModal()}
          >
            {t("dashboard.deleteProduct")}
          </button>
        </div>
      </details>
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
