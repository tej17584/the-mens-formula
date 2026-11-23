"use client";

import Image from "next/image";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/notify";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { withDashboardFlashStatus } from "@/lib/dashboard/products-list-query";
import {
  capDetailLines,
  MAX_DETAIL_POINTS,
} from "@/lib/dashboard/product-form-values";
import {
  createProductAction,
  updateProductAction,
  type DashboardActionState,
} from "@/actions/dashboard-products";
import { BrandLoader } from "@/components/ui/brand-loader";
import { NumericField } from "@/components/ui/numeric-input";
import { useTranslations } from "@/i18n";

type Option = { id: string; name: string };
type ExistingImage = { id: string; image_url: string; alt_text: string | null };
type ProductValues = {
  id: string;
  name: string;
  brand: { id: string } | null;
  category: { id: string } | null;
  description: string | null;
  short_description: string | null;
  detail_points: string[];
  sku: string | null;
  stock: number | null;
  consumer_price: number | null;
  price_3_plus: number | null;
  price_6_plus: number | null;
  box_price: number | null;
  is_available: boolean;
  is_active: boolean;
  internal: { distributor_unit_price: number | null } | null;
  images: ExistingImage[];
};

const initialState: DashboardActionState = {};
const maxUploadBytes = 5 * 1024 * 1024;

function ProductVisibilityFields({
  initialAvailable,
  initialActive,
  labels,
}: {
  initialAvailable: boolean;
  initialActive: boolean;
  labels: {
    availability: string;
    availabilityHelp: string;
    visible: string;
    visibilityHelp: string;
    section: string;
    sectionHelp: string;
  };
}) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isActive, setIsActive] = useState(initialActive);

  return (
    <section className="dashboard-form-section dashboard-visibility-section">
      <header>
        <h2>{labels.section}</h2>
        <p>{labels.sectionHelp}</p>
      </header>
      <div className="dashboard-toggle-grid">
        <label className="dashboard-toggle-card">
          <span>
            <strong>{labels.availability}</strong>
            <small>{labels.availabilityHelp}</small>
          </span>
          <input
            type="hidden"
            name="isAvailable"
            value={isAvailable ? "on" : ""}
          />
          <Switch
            checked={isAvailable}
            onCheckedChange={setIsAvailable}
            aria-label={labels.availability}
          />
        </label>
        <label className="dashboard-toggle-card">
          <span>
            <strong>{labels.visible}</strong>
            <small>{labels.visibilityHelp}</small>
          </span>
          <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            aria-label={labels.visible}
          />
        </label>
      </div>
    </section>
  );
}

export function ProductForm({
  brands,
  categories,
  inventoryListPath = "/dashboard/products",
  product,
}: {
  brands: Option[];
  categories: Option[];
  inventoryListPath?: string;
  product?: ProductValues;
}) {
  const t = useTranslations();
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string>();
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const syncFiles = useCallback((nextFiles: File[]) => {
    setFiles(nextFiles);
    const transfer = new DataTransfer();
    nextFiles.forEach((file) => transfer.items.add(file));
    if (imageInput.current) imageInput.current.files = transfer.files;
  }, []);
  const submitProduct = useCallback(
    async (
      previousState: DashboardActionState,
      formData: FormData,
    ): Promise<DashboardActionState> => {
      const result = product
        ? await updateProductAction(product.id, previousState, formData)
        : await createProductAction(previousState, formData);
      if (!result.success) return result;
      if (product) {
        syncFiles([]);
        setRemoved([]);
        router.refresh();
        notify.success(t("dashboard.flashProductUpdated"), {
          id: "dashboard-product-updated",
        });
        return result;
      }
      router.push(withDashboardFlashStatus(inventoryListPath, "created"));
      return result;
    },
    [product, router, inventoryListPath, t, syncFiles],
  );
  const [state, formAction, pending] = useActionState(
    submitProduct,
    initialState,
  );
  const [, startTransition] = useTransition();
  const visibilityKey = product
    ? `${product.id}-${product.is_available}-${product.is_active}`
    : "new";
  const remainingImages =
    product?.images.filter((image) => !removed.includes(image.id)) ?? [];
  const totalImages = remainingImages.length + files.length;
  const imageSlots = Math.max(0, 3 - totalImages);
  const previews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previews],
  );

  const addImages = (selected: File[]) => {
    const invalidType = selected.some(
      (file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type),
    );
    const invalidSize = selected.some((file) => file.size > maxUploadBytes);
    const uniqueSelected = selected.filter(
      (file) =>
        !files.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        ),
    );
    if (invalidType || invalidSize || uniqueSelected.length > imageSlots) {
      setImageError(
        invalidType
          ? t("dashboard.imagesInvalidType")
          : invalidSize
            ? t("dashboard.imagesTooLarge")
            : t("dashboard.imagesMaxReached"),
      );
      return;
    }
    if (uniqueSelected.length === 0) return;
    setImageError(undefined);
    syncFiles([...files, ...uniqueSelected]);
  };

  const selectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    addImages(selected);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("images");
    files.forEach((file) => formData.append("images", file));
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      className="dashboard-product-form"
      data-submitting={pending || undefined}
      onSubmit={handleSubmit}
    >
      {pending ? (
        <div className="dashboard-form-loading" aria-live="polite">
          <BrandLoader label={t("common.loading")} size="md" />
        </div>
      ) : null}
      <section className="dashboard-form-section">
        <header>
          <h2>{t("dashboard.productInformation")}</h2>
        </header>
        <div className="dashboard-form-grid">
          <label>
            <span>{t("dashboard.productName")}</span>
            <input name="name" required defaultValue={product?.name} />
          </label>
          <label>
            <span>{t("catalog.brand")}</span>
            <select name="brandId" required defaultValue={product?.brand?.id}>
              <option value="">{t("catalog.brand")}</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("catalog.category")}</span>
            <select
              name="categoryId"
              required
              defaultValue={product?.category?.id}
            >
              <option value="">{t("catalog.category")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="dashboard-static-field">
            <span>{t("dashboard.sku")}</span>
            <strong>{product?.sku ?? t("dashboard.skuGenerated")}</strong>
            <small>{t("dashboard.skuHelp")}</small>
          </div>
          <label>
            <span>{t("dashboard.stock")}</span>
            <NumericField
              name="stock"
              integer
              defaultValue={product?.stock ?? ""}
            />
          </label>
          <label>
            <span>{t("dashboard.publicPrice")}</span>
            <NumericField
              name="consumerPrice"
              defaultValue={product?.consumer_price ?? ""}
            />
          </label>
          <label>
            <span>{t("dashboard.distributorPrice")}</span>
            <NumericField
              name="distributorPrice"
              defaultValue={product?.internal?.distributor_unit_price ?? ""}
            />
          </label>
          <label>
            <span>{t("product.threePlus")}</span>
            <NumericField
              name="price3Plus"
              defaultValue={product?.price_3_plus ?? ""}
            />
          </label>
          <label>
            <span>{t("product.sixPlus")}</span>
            <NumericField
              name="price6Plus"
              defaultValue={product?.price_6_plus ?? ""}
            />
          </label>
          <label>
            <span>{t("product.box")}</span>
            <NumericField
              name="boxPrice"
              defaultValue={product?.box_price ?? ""}
            />
          </label>
        </div>
      </section>
      <section className="dashboard-form-section">
        <header>
          <h2>{t("dashboard.productContent")}</h2>
        </header>
        <label>
          <span>{t("dashboard.description")}</span>
          <textarea
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
          />
        </label>
        <label>
          <span>{t("dashboard.details")}</span>
          <textarea
            name="details"
            rows={MAX_DETAIL_POINTS}
            defaultValue={
              product?.detail_points.slice(0, MAX_DETAIL_POINTS).join("\n") ?? ""
            }
            onChange={(event) => {
              const next = capDetailLines(event.target.value);
              if (next !== event.target.value) event.target.value = next;
            }}
          />
          <span className="dashboard-field-help">{t("dashboard.detailsHelp")}</span>
        </label>
      </section>
      <section className="dashboard-form-section">
        <header>
          <h2>{t("dashboard.imagesSection")}</h2>
          <p>{t("dashboard.imagesHelp")}</p>
        </header>
        <div className="dashboard-image-uploader">
          <input
            ref={imageInput}
            className="dashboard-image-input"
            id="product-images"
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={imageSlots === 0}
            onChange={selectImages}
          />
          <label
            aria-disabled={imageSlots === 0}
            className="dashboard-image-dropzone"
            data-dragging={isDraggingImages || undefined}
            data-disabled={imageSlots === 0 || undefined}
            htmlFor="product-images"
            onDragEnter={(event) => {
              event.preventDefault();
              if (imageSlots > 0) setIsDraggingImages(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDraggingImages(false);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setIsDraggingImages(false);
              addImages(Array.from(event.dataTransfer.files));
            }}
          >
            <span aria-hidden="true" className="dashboard-image-upload-icon">
              <svg fill="none" viewBox="0 0 24 24">
                <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
              </svg>
            </span>
            <span>
              <strong>{t("dashboard.imageUploadPrompt")}</strong>
              <small>{t("dashboard.imageUploadDropHint")}</small>
            </span>
            <small>{t("dashboard.imagesFormatHelp")}</small>
          </label>
          <div aria-live="polite" className="dashboard-image-upload-status">
            <strong>
              {totalImages}/3 {t("dashboard.imagesConfigured")}
            </strong>
            <span>
              {imageSlots === 0
                ? t("dashboard.imagesMaxReached")
                : `${imageSlots} ${t("dashboard.imagesSlotsAvailable")}`}
            </span>
          </div>
          {imageError ? (
            <small className="form-helper-error" role="alert">
              {imageError}
            </small>
          ) : null}
        </div>
        <div className="dashboard-image-list">
          {remainingImages.map((image, index) => (
            <div className="dashboard-image-preview" key={image.id}>
              <Image
                src={image.image_url}
                alt={image.alt_text ?? ""}
                fill
                sizes="96px"
                quality={70}
              />
              {index === 0 ? (
                <span className="dashboard-image-primary">
                  {t("dashboard.mainImage")}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setRemoved((ids) => [...ids, image.id])}
              >
                {t("dashboard.remove")}
              </button>
            </div>
          ))}
          {previews.map((preview, index) => (
            <div className="dashboard-image-preview" key={preview.url}>
              {/* Previews are object URLs, so native img avoids remote optimization. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt={preview.name} />
              {remainingImages.length === 0 && index === 0 ? (
                <span className="dashboard-image-primary">
                  {t("dashboard.mainImage")}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  syncFiles(files.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                {t("dashboard.remove")}
              </button>
            </div>
          ))}
          {Array.from({ length: imageSlots }, (_, index) => (
            <div className="dashboard-image-empty-slot" key={`empty-${index}`}>
              <span aria-hidden="true">+</span>
              <small>{t("dashboard.imagesAvailable")}</small>
            </div>
          ))}
        </div>
      </section>
      {removed.map((id) => (
        <input key={id} type="hidden" name="removeImageId" value={id} />
      ))}
      <ProductVisibilityFields
        key={visibilityKey}
        initialAvailable={product?.is_available ?? true}
        initialActive={product?.is_active ?? true}
        labels={{
          section: t("dashboard.visibilitySection"),
          sectionHelp: t("dashboard.visibilitySectionHelp"),
          availability: t("dashboard.availability"),
          availabilityHelp: t("dashboard.availabilityHelp"),
          visible: t("dashboard.visible"),
          visibilityHelp: t("dashboard.visibilityHelp"),
        }}
      />
      {state.error ? (
        <Alert variant="destructive" className="dashboard-form-alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <button
        className="button button-primary dashboard-product-submit"
        type="submit"
        disabled={pending || totalImages > 3}
      >
        {pending ? (
          <>
            <BrandLoader size="sm" />
            <span>{t("common.loading")}</span>
          </>
        ) : product ? (
          t("dashboard.updateProduct")
        ) : (
          t("dashboard.createProduct")
        )}
      </button>
    </form>
  );
}
