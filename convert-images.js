/**
 * convert-images.js
 * Converts local images in /public to WebP format.
 * Run with: node convert-images.js
 *
 * - Outputs .webp files alongside originals (originals not deleted)
 * - Quality: 80
 * - Re-run this script when new project/showreel images are added
 */

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resize targets per directory — match actual rendered dimensions
const RESIZE_CONFIG = {
  "public/crew": { width: 400, height: 533, fit: "cover" },
  "public/logo": { width: 200, fit: "inside" }, // preserve aspect ratio
};

// Default for any other images found in /public
const DEFAULT_RESIZE = { width: 1200, fit: "inside" };

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getFiles(full)));
    } else if (EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

function getResizeConfig(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  for (const [prefix, config] of Object.entries(RESIZE_CONFIG)) {
    if (normalized.includes(prefix)) return config;
  }
  return DEFAULT_RESIZE;
}

async function convertFile(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  const outputPath = inputPath.slice(0, -ext.length) + ".webp";
  const resizeConfig = getResizeConfig(inputPath);

  const inputStats = await stat(inputPath);

  try {
    const outputStats = await stat(outputPath);
    if (outputStats.mtimeMs > inputStats.mtimeMs) {
      console.log(`  [skip]    ${basename(inputPath)} — WebP already up to date`);
      return { skipped: true };
    }
  } catch {
    // output doesn't exist yet — proceed
  }

  const instance = sharp(inputPath);
  const metadata = await instance.metadata();

  // Only resize down, never up
  const resize = { ...resizeConfig };
  if (resize.width && metadata.width && metadata.width <= resize.width) {
    delete resize.width;
    delete resize.height;
  }

  const { size } = await instance
    .resize(Object.keys(resize).length ? resize : undefined)
    .webp({ quality: 80 })
    .toFile(outputPath);

  const saving = (((inputStats.size - size) / inputStats.size) * 100).toFixed(1);
  console.log(
    `  [convert] ${basename(inputPath)} → ${basename(outputPath)}  ` +
    `${(inputStats.size / 1024).toFixed(0)}KB → ${(size / 1024).toFixed(0)}KB  (${saving}% smaller)`
  );

  return { inputPath, outputPath, inputSize: inputStats.size, outputSize: size };
}

async function main() {
  const publicDir = join(__dirname, "public");
  console.log("Scanning public/ for images...\n");

  const files = await getFiles(publicDir);
  if (files.length === 0) {
    console.log("No images found.");
    return;
  }

  console.log(`Found ${files.length} image(s):\n`);

  let totalIn = 0, totalOut = 0, converted = 0, skipped = 0;

  for (const file of files) {
    const result = await convertFile(file);
    if (!result.skipped) {
      totalIn += result.inputSize;
      totalOut += result.outputSize;
      converted++;
    } else {
      skipped++;
    }
  }

  console.log("\n────────────────────────────────────────");
  if (converted > 0) {
    const totalSaving = (((totalIn - totalOut) / totalIn) * 100).toFixed(1);
    console.log(
      `Converted ${converted} file(s). ` +
      `Total: ${(totalIn / 1024 / 1024).toFixed(2)}MB → ${(totalOut / 1024 / 1024).toFixed(2)}MB  (${totalSaving}% saved)`
    );
  }
  if (skipped > 0) console.log(`Skipped ${skipped} already up-to-date file(s).`);
  console.log("\nOriginals preserved. Update component src paths to use .webp when ready.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
