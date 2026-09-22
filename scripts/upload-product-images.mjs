import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

async function loadLocalEnvironment() {
  try {
    const contents = await fs.readFile(
      path.join(process.cwd(), ".env.local"),
      "utf8",
    );
    for (const line of contents.split(/\r?\n/u)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator < 1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed
        .slice(separator + 1)
        .trim()
        .replace(/^['"]|['"]$/gu, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

await loadLocalEnvironment();

const [preparedDirectory] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!preparedDirectory || !url || !serviceRoleKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run: node scripts/upload-product-images.mjs <prepared-images-directory>",
  );
}

async function filesIn(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(fullPath) : [fullPath];
    }),
  );
  return nested.flat();
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const files = await filesIn(preparedDirectory);
let uploaded = 0;
const unmatched = [];
for (const file of files.filter((candidate) => candidate.endsWith(".webp"))) {
  const relative = path.relative(preparedDirectory, file).replaceAll("\\", "/");
  const slug = path.basename(relative, ".webp");
  const { data: product, error: lookupError } = await supabase
    .from("products")
    .select("id,name")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (!product) {
    unmatched.push(relative);
    continue;
  }
  const objectPath = `${product.id}/main.webp`;
  const content = await fs.readFile(file);
  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(objectPath, content, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: true,
    });
  if (uploadError) throw uploadError;
  const { data: publicUrl } = supabase.storage
    .from("products")
    .getPublicUrl(objectPath);
  const verification = await fetch(publicUrl.publicUrl);
  if (!verification.ok) {
    throw new Error(
      `The uploaded image for ${product.name} is not publicly reachable (${verification.status}).`,
    );
  }
  await verification.body?.cancel();
  const { error: updateError } = await supabase
    .from("products")
    .update({ main_image_url: publicUrl.publicUrl })
    .eq("id", product.id);
  if (updateError) throw updateError;
  const { error: imageError } = await supabase.from("product_images").upsert(
    {
      product_id: product.id,
      image_url: publicUrl.publicUrl,
      alt_text: product.name,
      sort_order: 0,
    },
    { onConflict: "product_id,sort_order" },
  );
  if (imageError) throw imageError;
  uploaded += 1;
}
if (unmatched.length > 0) {
  console.warn(
    `Skipped ${unmatched.length} file(s) without a matching product slug: ${unmatched.join(", ")}`,
  );
}
console.log(
  `Uploaded and verified ${uploaded} optimized images in the products bucket.`,
);
