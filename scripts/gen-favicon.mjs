// Run: node scripts/gen-favicon.mjs
import sharp from "sharp";
import { createWriteStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Brand: black background, bold white "R" — matches site's black/white palette and Inter font style
function makeSvg(size) {
  const r = Math.round(size * 0.15); // corner radius scales with size
  const fontSize = Math.round(size * 0.62);
  const baseline = Math.round(size * 0.72);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#000000"/>
  <text x="${size / 2}" y="${baseline}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="auto">R</text>
</svg>`);
}

async function renderPng(size) {
  return sharp(makeSvg(size), { density: 300 })
    .resize(size, size)
    .png()
    .toBuffer();
}

// Build a proper ICO file containing 16×16 and 32×32 PNG images
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const dirSize = headerSize + entrySize * count;

  let offset = dirSize;
  const entries = pngBuffers.map((buf, i) => {
    const entry = Buffer.alloc(16);
    const dim = i === 0 ? 16 : 32; // first = 16px, second = 32px
    entry.writeUInt8(dim === 256 ? 0 : dim, 0); // width (0 = 256)
    entry.writeUInt8(dim === 256 ? 0 : dim, 1); // height
    entry.writeUInt8(0, 2);                      // color count
    entry.writeUInt8(0, 3);                      // reserved
    entry.writeUInt16LE(1, 4);                   // planes
    entry.writeUInt16LE(32, 6);                  // bit count
    entry.writeUInt32LE(buf.length, 8);          // bytes in resource
    entry.writeUInt32LE(offset, 12);             // offset
    offset += buf.length;
    return entry;
  });

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  console.log("Generating favicon assets…");

  const [png16, png32, png180] = await Promise.all([
    renderPng(16),
    renderPng(32),
    renderPng(180),
  ]);

  const ico = buildIco([png16, png32]);

  await Promise.all([
    // Replace the Next.js placeholder in app/
    writeFile(path.join(root, "app", "favicon.ico"), ico),
    // Public assets for explicit <link> tags
    writeFile(path.join(root, "public", "favicon.ico"), ico),
    writeFile(path.join(root, "public", "favicon-16x16.png"), png16),
    writeFile(path.join(root, "public", "favicon-32x32.png"), png32),
    writeFile(path.join(root, "public", "apple-touch-icon.png"), png180),
  ]);

  console.log("Done:");
  console.log("  app/favicon.ico");
  console.log("  public/favicon.ico");
  console.log("  public/favicon-16x16.png");
  console.log("  public/favicon-32x32.png");
  console.log("  public/apple-touch-icon.png");
}

main().catch((e) => { console.error(e); process.exit(1); });
