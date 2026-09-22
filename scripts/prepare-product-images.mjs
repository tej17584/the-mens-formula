import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import XLSX from "xlsx";

const [sourceDir, workbookPath, outputDir, manifestPath] =
  process.argv.slice(2);
if (!sourceDir || !workbookPath || !outputDir) {
  throw new Error(
    "Usage: node scripts/prepare-product-images.mjs <source-images> <workbook> <public-output>",
  );
}

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const normalized = (value) => slugify(value).replaceAll("-", "");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function findImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? findImages(fullPath)
        : imageExtensions.has(path.extname(entry.name).toLowerCase())
          ? [fullPath]
          : [];
    }),
  );
  return nested.flat();
}

const allImages = await findImages(sourceDir);
const book = XLSX.readFile(workbookPath);
let prepared = 0;
const preparedUrls = [];
for (const brand of book.SheetNames) {
  const rows = XLSX.utils.sheet_to_json(book.Sheets[brand], { defval: null });
  for (const row of rows) {
    const name = row["NOMBRE DE PRODUCTOS"];
    if (!name) continue;
    const productSlug = `${slugify(brand)}-${slugify(name)}`;
    const needle = normalized(name).slice(0, 10);
    const candidates = allImages.filter((file) =>
      normalized(file).includes(needle),
    );
    const source = candidates.sort((a, b) => a.length - b.length)[0];
    if (!source) continue;
    const destination = path.join(
      outputDir,
      slugify(brand),
      `${productSlug}.webp`,
    );
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await sharp(source)
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(destination);
    preparedUrls.push(`/catalogo/${slugify(brand)}/${productSlug}.webp`);
    prepared += 1;
  }
}
if (manifestPath) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(
    manifestPath,
    JSON.stringify(preparedUrls.sort(), null, 2),
    "utf8",
  );
}
console.log(`Prepared ${prepared} optimized product images in ${outputDir}`);
