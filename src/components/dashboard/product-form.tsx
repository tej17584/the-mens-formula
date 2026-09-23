"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProductAction,
  updateProductAction,
  type DashboardActionState,
} from "@/actions/dashboard-products";
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

export function ProductForm({
  brands,
  categories,
  product,
}: {
  brands: Option[];
  categories: Option[];
  product?: ProductValues;
}) {
  const t = useTranslations();
  const router = useRouter();
  const imageInput = useRef<HTMLInputElement>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string>();
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);
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
  useEffect(() => {
    if (state.success) router.push("/dashboard/products");
  }, [state.success, router]);

  const syncFiles = (nextFiles: File[]) => {
    setFiles(nextFiles);
    const transfer = new DataTransfer();
    nextFiles.forEach((file) => transfer.items.add(file));
    if (imageInput.current) imageInput.current.files = transfer.files;
  };

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

  return (
    <form className="dashboard-product-form" action={formAction}>
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
            <input
              name="stock"
              type="number"
              min="0"
              defaultValue={product?.stock ?? ""}
            />
          </label>
          <label>
            <span>{t("dashboard.publicPrice")}</span>
            <input
              name="consumerPrice"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.consumer_price ?? ""}
            />
          </label>
          <label>
            <span>{t("dashboard.distributorPrice")}</span>
            <input
              name="distributorPrice"
              type="number"
              min="0"
              step="0.00000001"
              defaultValue={product?.internal?.distributor_unit_price ?? ""}
            />
          </label>
          <label>
            <span>{t("product.threePlus")}</span>
            <input
              name="price3Plus"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.price_3_plus ?? ""}
            />
          </label>
          <label>
            <span>{t("product.sixPlus")}</span>
            <input
              name="price6Plus"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.price_6_plus ?? ""}
            />
          </label>
          <label>
            <span>{t("product.box")}</span>
            <input
              name="boxPrice"
              type="number"
              min="0"
              step="0.01"
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
            rows={5}
            defaultValue={product?.detail_points.join("\n") ?? ""}
          />
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
      <section className="dashboard-form-section dashboard-visibility-section">
        <header>
          <h2>{t("dashboard.visibilitySection")}</h2>
        </header>
        <div className="dashboard-switches">
          <label>
            <input
              name="isAvailable"
              type="checkbox"
              defaultChecked={product?.is_available ?? true}
            />{" "}
            {t("dashboard.availability")}
          </label>
          <label>
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={product?.is_active ?? true}
            />{" "}
            {t("dashboard.visible")}
          </label>
        </div>
      </section>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="button button-primary"
        type="submit"
        disabled={pending || totalImages > 3}
      >
        {product ? t("dashboard.updateProduct") : t("dashboard.createProduct")}
      </button>
    </form>
  );
}
