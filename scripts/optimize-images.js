const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_DIRS = ['images'];

async function optimizeImages() {
  for (const dir of IMAGE_DIRS) {
    const dirPath = path.join(PUBLIC_DIR, dir);
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const filePath = path.join(dirPath, file);
        const webpPath = filePath.replace(/\.[^.]+$/, '.webp');

        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(webpPath);

        console.log(`Optimized: ${file} -> ${path.basename(webpPath)}`);
      }
    }
  }
}

optimizeImages().catch(console.error);
