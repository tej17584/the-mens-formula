"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createBrandAction,
  createCategoryAction,
  type ReferenceActionState,
} from "@/actions/dashboard-references";
import { useTranslations } from "@/i18n";

const initialState: ReferenceActionState = {};

function ReferencePanel({
  kind,
  values,
}: {
  kind: "brand" | "category";
  values: { id: string; name: string; slug: string }[];
}) {
  const t = useTranslations();
  const form = useRef<HTMLFormElement>(null);
  const action = kind === "brand" ? createBrandAction : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) form.current?.reset();
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
          {t("dashboard.referenceCreated")}
        </p>
      ) : null}
      <ul>
        {values.map((value) => (
          <li key={value.id}>
            <strong>{value.name}</strong>
            <small>{value.slug}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CatalogReferenceManager({
  brands,
  categories,
}: {
  brands: { id: string; name: string; slug: string }[];
  categories: { id: string; name: string; slug: string }[];
}) {
  return (
    <div className="dashboard-reference-grid">
      <ReferencePanel kind="brand" values={brands} />
      <ReferencePanel kind="category" values={categories} />
    </div>
  );
}
