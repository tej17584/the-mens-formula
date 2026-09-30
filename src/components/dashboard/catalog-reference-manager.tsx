"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  manageBrandAction,
  manageCategoryAction,
  type ReferenceActionState,
} from "@/actions/dashboard-references";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success === "created") {
      form.current?.reset();
      toast.success(t("dashboard.referenceCreated"), {
        id: "dashboard-reference-created",
      });
    }
    if (state.success === "deleted") {
      setPendingDelete(null);
      toast.success(t("dashboard.referenceDeleted"), {
        id: "dashboard-reference-deleted",
      });
    }
  }, [state.success, t]);

  const isBrand = kind === "brand";
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardDescription>
              {isBrand ? t("dashboard.brands") : t("dashboard.categories")}
            </CardDescription>
            <CardTitle>
              {isBrand
                ? t("dashboard.manageBrands")
                : t("dashboard.manageCategories")}
            </CardTitle>
          </div>
          <Badge variant="secondary">{values.length}</Badge>
        </div>
        <p className="dashboard-field-help">
          {isBrand ? t("dashboard.brandHelp") : t("dashboard.categoryHelp")}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form ref={form} className="dashboard-reference-create" action={formAction}>
          <input name="intent" type="hidden" value="create" />
          <Input
            name="name"
            placeholder={t("dashboard.referenceName")}
            required
          />
          <Button disabled={pending} type="submit">
            {isBrand ? t("dashboard.addBrand") : t("dashboard.addCategory")}
          </Button>
        </form>
        {state.error ? (
          <Alert variant="destructive">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}
        <ul className="dashboard-reference-list">
          {values.map((value) => (
            <li key={value.id}>
              <div className="dashboard-reference-copy">
                <strong>{value.name}</strong>
                <small>{value.slug}</small>
              </div>
              <div className="dashboard-reference-actions">
                <span>
                  {value.productCount} {t("dashboard.associatedProducts")}
                </span>
                <Button
                  aria-label={`${t("common.delete")} ${value.name}`}
                  variant="destructive"
                  size="sm"
                  disabled={value.productCount > 0}
                  title={
                    value.productCount > 0
                      ? t("dashboard.referenceInUse")
                      : undefined
                  }
                  type="button"
                  onClick={() =>
                    setPendingDelete({ id: value.id, name: value.name })
                  }
                >
                  {t("common.delete")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dashboard.deleteReferenceTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboard.deleteReferenceConfirmation")} {pendingDelete?.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <form action={formAction}>
              <input name="id" type="hidden" value={pendingDelete?.id ?? ""} />
              <input name="intent" type="hidden" value="delete" />
              <AlertDialogAction
                variant="destructive"
                disabled={pending}
                type="submit"
              >
                {t("common.delete")}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
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
