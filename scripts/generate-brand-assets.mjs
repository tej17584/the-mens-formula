import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = path.resolve(
  "C:/Users/josea/Desktop/proyecto-eduardo/logo-nuevo.jpg",
);
const publicDir = path.resolve("public");
const appDir = path.resolve("src/app");

const WHITE_CUTOFF = 14;
const WHITE_OPAQUE = 48;
const PAD = 28;

function withAlpha(pixels) {
  const next = Buffer.from(pixels);
  for (let i = 0; i < next.length; i += 4) {
    const distance = Math.hypot(
      255 - next[i],
      255 - next[i + 1],
      255 - next[i + 2],
    );
    if (distance <= WHITE_CUTOFF) {
      next[i + 3] = 0;
    } else if (distance < WHITE_OPAQUE) {
      next[i + 3] = Math.round(
        ((distance - WHITE_CUTOFF) / (WHITE_OPAQUE - WHITE_CUTOFF)) * 255,
      );
    }
  }
  return next;
}

function invertRgb(pixels) {
  const next = Buffer.from(pixels);
  for (let i = 0; i < next.length; i += 4) {
    if (next[i + 3] === 0) continue;
    next[i] = 255 - next[i];
    next[i + 1] = 255 - next[i + 1];
    next[i + 2] = 255 - next[i + 2];
  }
  return next;
}

async function toPng(raw, width, height) {
  return sharp(raw, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 0 })
    .extend({
      top: PAD,
      bottom: PAD,
      left: PAD,
      right: PAD,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function pngToIco(images) {
  const count = images.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const entries = images.map((image) => {
    const entry = {
      width: image.size >= 256 ? 0 : image.size,
      height: image.size >= 256 ? 0 : image.size,
      bytes: image.png.length,
      offset,
    };
    offset += image.png.length;
    return entry;
  });

  const ico = Buffer.alloc(offset);
  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(count, 4);

  entries.forEach((entry, index) => {
    const p = 6 + index * 16;
    ico.writeUInt8(entry.width, p);
    ico.writeUInt8(entry.height, p + 1);
    ico.writeUInt8(0, p + 2);
    ico.writeUInt8(0, p + 3);
    ico.writeUInt16LE(1, p + 4);
    ico.writeUInt16LE(32, p + 6);
    ico.writeUInt32LE(entry.bytes, p + 8);
    ico.writeUInt32LE(entry.offset, p + 12);
    images[index].png.copy(ico, entry.offset);
  });

  return ico;
}

async function squareMark(raw, width, height, size, background) {
  const sourcePng = await sharp(raw, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  const mark = await sharp(sourcePng)
    .extract({ left: 275, top: 97, width: 973, height: 455 })
    .png()
    .toBuffer();

  const fitted = await sharp(mark)
    .resize(Math.round(size * 0.84), Math.round(size * 0.84), {
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: fitted, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const lightRaw = withAlpha(data);
const darkRaw = invertRgb(lightRaw);
const lightPng = await toPng(lightRaw, info.width, info.height);
const darkPng = await toPng(darkRaw, info.width, info.height);
const lightMeta = await sharp(lightPng).metadata();

await Promise.all([
  writeFile(path.join(publicDir, "logo-light.png"), lightPng),
  writeFile(path.join(publicDir, "logo-dark.png"), darkPng),
  writeFile(path.join(publicDir, "logo-header-light.png"), lightPng),
  writeFile(path.join(publicDir, "logo-header-dark.png"), darkPng),
  writeFile(path.join(publicDir, "logo-full-light.png"), lightPng),
  writeFile(path.join(publicDir, "logo-full-dark.png"), darkPng),
]);

const white = { r: 255, g: 255, b: 255, alpha: 255 };
const icon = await squareMark(lightRaw, info.width, info.height, 512, white);
const apple = await squareMark(lightRaw, info.width, info.height, 180, white);
const favicons = await Promise.all(
  [16, 32, 48].map(async (size) => ({
    size,
    png: await squareMark(lightRaw, info.width, info.height, size, white),
  })),
);
const faviconIco = pngToIco(favicons);

await Promise.all([
  writeFile(path.join(appDir, "icon.png"), icon),
  writeFile(path.join(appDir, "apple-icon.png"), apple),
  writeFile(path.join(appDir, "favicon.ico"), faviconIco),
  writeFile(path.join(publicDir, "favicon.ico"), faviconIco),
]);

console.log(
  JSON.stringify(
    {
      logo: { width: lightMeta.width, height: lightMeta.height },
      files: [
        "public/logo-light.png",
        "public/logo-dark.png",
        "public/logo-header-light.png",
        "public/logo-header-dark.png",
        "public/logo-full-light.png",
        "public/logo-full-dark.png",
        "src/app/icon.png",
        "src/app/apple-icon.png",
        "src/app/favicon.ico",
        "public/favicon.ico",
      ],
    },
    null,
    2,
  ),
);
