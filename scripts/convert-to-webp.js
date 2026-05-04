import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function getImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getImages(fullPath));
    } else if (EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convertToWebP(inputPath) {
  const ext = extname(inputPath);
  const outputPath = inputPath.slice(0, -ext.length) + '.webp';

  try {
    const outStat = await stat(outputPath);
    if (outStat.isFile()) {
      console.log(`[SKIPPED] ${basename(inputPath)} -> ${basename(outputPath)} (Already exists)`);
      return;
    }
  } catch (err) {
    // File does not exist, proceed with conversion
  }

  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`[CONVERTED] ${basename(inputPath)} -> ${basename(outputPath)}`);
  } catch (err) {
    console.error(`[ERROR] Failed to convert ${basename(inputPath)}:`, err.message);
  }
}

async function main() {
  console.log('Scanning public/ directory for .jpg and .png files...\n');
  try {
    const images = await getImages(PUBLIC_DIR);
    if (images.length === 0) {
      console.log('No JPG or PNG files found.');
      return;
    }

    console.log(`Found ${images.length} images. Starting conversion...\n`);
    for (const image of images) {
      await convertToWebP(image);
    }
    console.log('\nConversion complete.');
  } catch (err) {
    console.error('Error during conversion:', err);
    process.exit(1);
  }
}

main();