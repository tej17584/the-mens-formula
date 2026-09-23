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
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const remainingImages =
    product?.images.filter((image) => !removed.includes(image.id)) ?? [];
  const totalImages = remainingImages.length + files.length;
  const imageSlots = Math.max(0, 3 - remainingImages.length);
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

  const selectImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.currentTarget.files ?? []);
    const invalidCount = selected.length > imageSlots;
    const invalidSize = selected.some((file) => file.size > maxUploadBytes);
    if (invalidCount || invalidSize) {
      event.currentTarget.value = "";
      setFiles([]);
      setImageError(
        invalidCount
          ? t("dashboard.imagesMaxReached")
          : t("dashboard.imagesTooLarge"),
      );
      return;
    }
    setImageError(undefined);
    setFiles(selected);
  };

  return (
    <form className="dashboard-product-form" action={formAction}>
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
      <label>
        <span>{t("dashboard.images")}</span>
        <input
          ref={imageInput}
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={imageSlots === 0}
          onChange={selectImages}
        />
        <small>
          {imageSlots === 0
            ? t("dashboard.imagesMaxReached")
            : t("dashboard.imagesHelp")}
        </small>
        {imageError ? (
          <small className="form-helper-error" role="alert">
            {imageError}
          </small>
        ) : null}
      </label>
      <div className="dashboard-image-list">
        {remainingImages.map((image) => (
          <div className="dashboard-image-preview" key={image.id}>
            <Image
              src={image.image_url}
              alt={image.alt_text ?? ""}
              fill
              sizes="96px"
              quality={70}
            />
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
      </div>
      {removed.map((id) => (
        <input key={id} type="hidden" name="removeImageId" value={id} />
      ))}
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
