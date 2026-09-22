import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const sourceDirectory = process.argv[2];
const replace = process.argv.includes("--replace");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = "products";

if (!sourceDirectory || !url || !serviceRoleKey) {
  throw new Error(
    "Usage: node --env-file=.env.local scripts/migrate-product-images.mjs <source-directory> --replace",
  );
}

const slugify = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const tokenSet = (value) =>
  new Set(
    slugify(value)
      .split("-")
      .filter(
        (token) =>
          token.length > 1 && !["para", "con", "del", "de"].includes(token),
      ),
  );

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    }),
  );
  return nested
    .flat()
    .filter((file) => /\.(avif|jpe?g|png|webp)$/iu.test(file));
}

function brandFromDirectory(directory) {
  const key = slugify(directory);
  if (key === "level-3") return "level3";
  if (key === "inmortal") return "immortal";
  return key;
}

function score(sourceName, productName) {
  const source = slugify(sourceName);
  const product = slugify(productName);
  if (source === product) return 100;
  if (product.includes(source) || source.includes(product)) return 60;
  const sourceTokens = tokenSet(source);
  const productTokens = tokenSet(product);
  const overlap = [...sourceTokens].filter((token) =>
    productTokens.has(token),
  ).length;
  return overlap * 10;
}

const explicitSlugs = new Map([
  ["4x4|balsamo-negro", "4x4-balsamo-negro-liquido-para-aerografo"],
  ["4x4|cera-gel-4x4", "4x4-cera-gel-4x4-profesional-280g"],
  ["4x4|enfriador-para-maquinas", "4x4-enfriador-para-maquinas"],
  ["4x4|minoxidil-liquido", "4x4-minoxidil-liquido-4x4"],
  ["4x4|pasta-profesional", "4x4-pasta-4x4-profesional-100g"],
  ["4x4|polvo-voluminizador-seco", "4x4-polvo-voluminizador-seco"],
  ["4x4|pomada-profesional", "4x4-pomada-4x4-profesional-100g"],
  ["4x4|shampoo-con-minoxidil", "4x4-shampoo-cbd-minoxidil"],
  ["4x4|talco-dorado", "4x4-talco-dorado-invensible-4x4-profesional"],
  ["4x4|tela-de-arana-aroma-banana", "4x4-cera-telarana-aroma-banana"],
  ["4x4|tela-de-arana-aroma-chicle", "4x4-cera-telarana-aroma-chicle"],
  ["agiva|agiva-10-grey-tela-de-arana", "agiva-agiva-10-grey-tela-de-arana"],
  ["evok|after-shave", "evok-after-shave-evok"],
  ["evok|azul", "evok-evoc-azul"],
  ["evok|blanca", "evok-evoc-blanco"],
  ["evok|evok-negra", "evok-evoc-negro"],
  ["evok|roja", "evok-evoc-rojo"],
  ["evok|sabila", "evok-evoc-sabila"],
  ["evok|coco", "evok-evoc-coco"],
  ["evok|fresa", "evok-evoc-fresa"],
  ["evok|manzana", "evok-evoc-manzana"],
  ["evok|shaving-gel", "evok-shaving-gel-evok"],
  [
    "evok|tubo-de-papel-cuello-blanco",
    "evok-tubo-de-papel-cuello-color-blanco",
  ],
  ["evok|tubo-de-papel-cuello-negro", "evok-tubo-de-papel-cuello-color-negro"],
  ["level3|blak-mask", "level3-black-mask"],
  ["level3|after-shave-aqua", "level3-after-shave-aqua"],
  ["level3|after-shave-fresh", "level3-after-shave-fresh"],
  ["level3|after-shave-frots", "level3-after-shave-frost"],
  ["level3|after-shave-midnight", "level3-after-shave-midnight"],
  ["level3|rose", "level3-after-shave-rose"],
  ["level3|after-shave-royale", "level3-after-shave-royale"],
  ["level3|after-shave-vibrant", "level3-after-shave-vibrant"],
  ["level3|shavin-gel-aqua", "level3-shaving-gel-aqua"],
  ["level3|shavin-gel-ice", "level3-shaving-gel-ice"],
  ["xiomara|moldeadora", "xiomara-cera-moldeadora-xiomara"],
  ["xiomara|tela-de-arana", "xiomara-tela-de-arana-xiomara"],
]);

function sourceProductName(parts, fileName) {
  const brand = brandFromDirectory(parts[0]);
  const parent = parts.at(-2);
  const grandparent = parts.at(-3);
  if (brand === "agiva" && /^10\./u.test(fileName))
    return "agiva-10-grey-tela-de-arana";
  if (brand === "level3" && slugify(grandparent) === "after-shave")
    return `after-shave-${slugify(parent)}`;
  if (brand === "level3" && slugify(grandparent) === "shavin-gel")
    return `shavin-gel-${slugify(parent)}`;
  return slugify(parent);
}

async function listObjectPaths(prefix = "") {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
  });
  if (error) throw error;
  const paths = [];
  for (const item of data ?? []) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id) paths.push(itemPath);
    else paths.push(...(await listObjectPaths(itemPath)));
  }
  return paths;
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: products, error: productError } = await supabase
  .from("products")
  .select("id,name,slug,brand:brands!inner(slug)");
if (productError) throw productError;

const files = await listFiles(sourceDirectory);
const associations = new Map();
const unmatched = [];
for (const file of files) {
  const relative = path.relative(sourceDirectory, file);
  const parts = relative.split(path.sep);
  const brand = brandFromDirectory(parts[0]);
  const fileName = path.basename(file);
  const sourceName = sourceProductName(parts, fileName);
  const alias = explicitSlugs.get(`${brand}|${sourceName}`);
  const candidates = products.filter((product) => product.brand.slug === brand);
  const ranked = candidates
    .map((product) => ({ product, score: score(sourceName, product.name) }))
    .sort((first, second) => second.score - first.score);
  const product = alias
    ? products.find((candidate) => candidate.slug === alias)
    : ranked[0]?.score > 0 && ranked[0].score > (ranked[1]?.score ?? -1)
      ? ranked[0].product
      : null;
  if (!product) {
    unmatched.push(relative);
    continue;
  }
  const list = associations.get(product.slug) ?? [];
  list.push({ file, relative, product });
  associations.set(product.slug, list);
}

const overLimit = [...associations.entries()].filter(
  ([, images]) => images.length > 3,
);
const missingProducts = products.filter(
  (product) => !associations.has(product.slug),
);
if (unmatched.length || overLimit.length || missingProducts.length) {
  throw new Error(
    [
      `Preflight failed: ${files.length} source files, ${associations.size}/${products.length} products associated.`,
      unmatched.length ? `Unmatched files:\n${unmatched.join("\n")}` : "",
      overLimit.length
        ? `Products above 3 images:\n${overLimit.map(([slug, images]) => `${slug}: ${images.length}`).join("\n")}`
        : "",
      missingProducts.length
        ? `Products without images:\n${missingProducts.map((product) => product.slug).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  );
}

console.log(
  `Preflight passed: ${files.length} images mapped to ${associations.size} products (maximum ${Math.max(...[...associations.values()].map((images) => images.length))} per product).`,
);
if (!replace) {
  console.log(
    "Dry run only. Add --replace to remove existing product media and upload the new optimized files.",
  );
  process.exit(0);
}

const objectPaths = await listObjectPaths();
for (let index = 0; index < objectPaths.length; index += 100) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove(objectPaths.slice(index, index + 100));
  if (error) throw error;
}
const { error: imageDeleteError } = await supabase
  .from("product_images")
  .delete()
  .not("product_id", "is", null);
if (imageDeleteError) throw imageDeleteError;
const { error: mainImageResetError } = await supabase
  .from("products")
  .update({ main_image_url: null })
  .not("id", "is", null);
if (mainImageResetError) throw mainImageResetError;

let uploaded = 0;
for (const images of associations.values()) {
  for (const [index, image] of images.entries()) {
    const output = await sharp(image.file)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84, effort: 5 })
      .toBuffer();
    const objectPath = `${image.product.id}/${index + 1}.webp`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(objectPath, output, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
    if (uploadError) throw uploadError;
    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(objectPath);
    const verification = await fetch(publicUrl.publicUrl);
    if (!verification.ok) {
      throw new Error(
        `${image.relative} uploaded but is not publicly reachable (${verification.status}).`,
      );
    }
    await verification.body?.cancel();
    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: image.product.id,
      image_url: publicUrl.publicUrl,
      alt_text: image.product.name,
      sort_order: index,
    });
    if (imageError) throw imageError;
    if (index === 0) {
      const { error: productUpdateError } = await supabase
        .from("products")
        .update({ main_image_url: publicUrl.publicUrl })
        .eq("id", image.product.id);
      if (productUpdateError) throw productUpdateError;
    }
    uploaded += 1;
  }
}

const { data: verificationProducts, error: verificationError } = await supabase
  .from("products")
  .select("id,main_image_url,images:product_images(id,sort_order)");
if (verificationError) throw verificationError;
const incomplete = verificationProducts.filter(
  (product) =>
    !product.main_image_url ||
    product.images.length < 1 ||
    product.images.length > 3,
);
if (incomplete.length)
  throw new Error(
    `Post-upload verification failed for ${incomplete.length} products.`,
  );
console.log(
  `Replaced the bucket with ${uploaded} optimized WebP images for ${verificationProducts.length} products.`,
);
