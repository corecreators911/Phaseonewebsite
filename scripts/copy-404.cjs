const fs = require("fs");
const path = require("path");

const docsDir = path.resolve(__dirname, "..", "docs");
const indexPath = path.join(docsDir, "index.html");
const fallbackPath = path.join(docsDir, "404.html");

if (!fs.existsSync(indexPath)) {
  console.error("Build output missing: docs/index.html");
  process.exit(1);
}

fs.copyFileSync(indexPath, fallbackPath);
console.log("Created GitHub Pages SPA fallback:", fallbackPath);
