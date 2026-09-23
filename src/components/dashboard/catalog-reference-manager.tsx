"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  manageBrandAction,
  manageCategoryAction,
  type ReferenceActionState,
} from "@/actions/dashboard-references";
import { useTranslations } from "@/i18n";

const initialState: ReferenceActionState = {};

type ReferenceAction = (
  previousState: ReferenceActionState,
  formData: FormData,
) => Promise<ReferenceActionState>;

function ReferencePanel({
  action,
  kind,
  values,
}: {
  action: ReferenceAction;
  kind: "brand" | "category";
  values: { id: string; name: string; slug: string; productCount: number }[];
}) {
  const t = useTranslations();
  const form = useRef<HTMLFormElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success === "created") form.current?.reset();
    if (state.success === "deleted") {
      dialog.current?.close();
    }
  }, [state.success]);

  const isBrand = kind === "brand";
  return (
    <section className="dashboard-reference-panel">
      <header>
        <div>
          <p className="eyebrow">
            {isBrand ? t("dashboard.brands") : t("dashboard.categories")}
          </p>
          <h2>
            {isBrand
              ? t("dashboard.manageBrands")
              : t("dashboard.manageCategories")}
          </h2>
        </div>
        <span>{values.length}</span>
      </header>
      <p>{isBrand ? t("dashboard.brandHelp") : t("dashboard.categoryHelp")}</p>
      <form ref={form} action={formAction}>
        <input name="intent" type="hidden" value="create" />
        <label>
          <span className="sr-only">{t("dashboard.referenceName")}</span>
          <input
            name="name"
            placeholder={t("dashboard.referenceName")}
            required
          />
        </label>
        <button
          className="button button-primary"
          disabled={pending}
          type="submit"
        >
          {isBrand ? t("dashboard.addBrand") : t("dashboard.addCategory")}
        </button>
      </form>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="form-success" role="status">
          {t(
            state.success === "created"
              ? "dashboard.referenceCreated"
              : "dashboard.referenceDeleted",
          )}
        </p>
      ) : null}
      <ul>
        {values.map((value) => (
          <li key={value.id}>
            <div>
              <strong>{value.name}</strong>
              <small>{value.slug}</small>
            </div>
            <div className="dashboard-reference-actions">
              <span>
                {value.productCount} {t("dashboard.associatedProducts")}
              </span>
              <button
                aria-label={`${t("common.delete")} ${value.name}`}
                className="dashboard-reference-delete"
                disabled={value.productCount > 0}
                title={
                  value.productCount > 0
                    ? t("dashboard.referenceInUse")
                    : undefined
                }
                type="button"
                onClick={() => {
                  setPendingDelete({ id: value.id, name: value.name });
                  dialog.current?.showModal();
                }}
              >
                {t("common.delete")}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <dialog
        aria-labelledby={`reference-delete-title-${kind}`}
        className="confirm-dialog"
        ref={dialog}
      >
        <div className="confirm-dialog-content">
          <div className="confirm-dialog-heading">
            <span aria-hidden="true" className="confirm-dialog-icon">
              <svg fill="none" viewBox="0 0 24 24">
                <path d="M12 8v4m0 4h.01M10.3 3.9 2.7 17.1A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
            </span>
            <div>
              <h3 id={`reference-delete-title-${kind}`}>
                {t("dashboard.deleteReferenceTitle")}
              </h3>
              <p>{t("dashboard.deleteReferenceConfirmation")}</p>
            </div>
            <button
              aria-label={t("common.cancel")}
              className="confirm-dialog-close"
              type="button"
              onClick={() => dialog.current?.close()}
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <strong className="confirm-dialog-value">
            {pendingDelete?.name}
          </strong>
          <form action={formAction}>
            <input name="id" type="hidden" value={pendingDelete?.id ?? ""} />
            <input name="intent" type="hidden" value="delete" />
            <button
              className="button danger-button"
              disabled={pending}
              type="submit"
            >
              {t("common.delete")}
            </button>
            <button
              className="button button-secondary"
              disabled={pending}
              type="button"
              onClick={() => dialog.current?.close()}
            >
              {t("common.cancel")}
            </button>
          </form>
        </div>
      </dialog>
    </section>
  );
}

export function CatalogReferenceManager({
  brands,
  categories,
}: {
  brands: { id: string; name: string; slug: string; productCount: number }[];
  categories: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
}) {
  return (
    <div className="dashboard-reference-grid">
      <ReferencePanel action={manageBrandAction} kind="brand" values={brands} />
      <ReferencePanel
        action={manageCategoryAction}
        kind="category"
        values={categories}
      />
    </div>
  );
}
